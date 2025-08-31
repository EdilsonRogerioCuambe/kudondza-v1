/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Session } from "better-auth";
import { NextResponse } from "next/server";
import { v4 } from "uuid";
import { ensurePrivateBucket } from "./ensure-private-bucket";
import { env } from "./env";
import prisma from "./prisma";
import { S3 } from "./s3-client";

// Função para upload direto
export async function handleDirectUpload(
  request: Request,
  session: { session: Session; user: any }
) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const courseId = formData.get("courseId") as string;
    const tempUpload = formData.get("tempUpload") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("📦 Arquivo recebido:", {
      name: file.name,
      size: file.size,
      type: file.type,
      courseId,
      tempUpload,
    });

    // Determinar tipo do arquivo
    const fileType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
      ? "video"
      : "document";

    const fileExtension = file.name.split(".").pop() || "";

    // Verificar configuração
    if (!env.NEXT_PUBLIC_R2_BUCKET_NAME) {
      console.error("❌ R2_BUCKET_NAME não configurado");
      return NextResponse.json(
        { error: "Configuração R2 não encontrada" },
        { status: 500 }
      );
    }

    // Usar bucket privado para uploads (não o público "kudondza")
    const privateBucketName = `${env.NEXT_PUBLIC_R2_BUCKET_NAME}-private`;
    const fallbackBucketName = env.NEXT_PUBLIC_R2_BUCKET_NAME;

    console.log("🪣 Tentando usar bucket privado:", privateBucketName);

    // Verificar se bucket privado existe, senão usar o principal
    let bucketToUse = privateBucketName;
    try {
      await ensurePrivateBucket(privateBucketName);
      console.log("✅ Usando bucket privado:", privateBucketName);
    } catch (error) {
      console.log("⚠️  Erro ao acessar bucket privado:", error);
      console.log(
        "⚠️  Bucket privado não existe, usando bucket principal:",
        fallbackBucketName
      );
      bucketToUse = fallbackBucketName;
    }

    const uniqueKey = `${v4()}-${file.name}`;
    console.log("🔑 Chave única gerada:", uniqueKey);

    // Fazer upload direto para R2 (agora com permissões corretas)
    console.log("📤 Fazendo upload direto para bucket privado...");

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketToUse,
      Key: uniqueKey,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      ContentLength: file.size,
    });

    try {
      const result = await S3.send(uploadCommand);
      console.log("✅ Upload direto concluído com sucesso:", result.ETag);
    } catch (uploadError: unknown) {
      const error = uploadError as Error & {
        Code?: string;
        $metadata?: { httpStatusCode?: number };
      };
      console.error("❌ Erro no upload direto:", {
        name: error.name,
        message: error.message,
        code: error.Code,
        statusCode: error.$metadata?.httpStatusCode,
        bucket: bucketToUse,
        key: uniqueKey,
      });

      // Se ainda der 403, as credenciais não têm permissão
      if (error.$metadata?.httpStatusCode === 403) {
        throw new Error(
          `Credenciais R2 não têm permissão para upload. Verifique as políticas de acesso.`
        );
      }

      throw new Error(`Erro no upload: ${error.message}`);
    }

    // Gerar URL pré-assinada para acesso (válida por 24h)
    console.log("🔑 Gerando URL pré-assinada para acesso...");
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketToUse,
      Key: uniqueKey,
    });

    const presignedUrl = await getSignedUrl(S3, getObjectCommand, {
      expiresIn: 24 * 60 * 60, // 24 horas
    });

    // URL interna do arquivo (R2 format)
    const fileUrl = `${env.R2_ENDPOINT_URL}/${bucketToUse}/${uniqueKey}`;

    console.log("💾 Salvando metadados no banco...");
    const fileUpload = await prisma.fileUpload.create({
      data: {
        fileName: file.name,
        fileKey: uniqueKey,
        fileUrl,
        fileType,
        fileSize: file.size,
        contentType: file.type,
        fileExtension,
        description: null,
        tags: [],
        uploadStatus: "COMPLETED",
        userId: session.user.id,
        courseId: courseId || null,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        tempUpload: tempUpload || false,
      },
    });

    console.log("✅ Metadados salvos, ID:", fileUpload.id);

    return NextResponse.json({
      success: true,
      message: "Arquivo enviado com sucesso",
      fileUrl,
      presignedUrl, // URL temporária para acesso
      fileUploadId: fileUpload.id,
      key: uniqueKey,
    });
  } catch (error) {
    console.error("❌ Erro no upload direto:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
