/* eslint-disable @typescript-eslint/no-explicit-any */
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Session } from "better-auth";
import { NextResponse } from "next/server";
import { v4 } from "uuid";
import { ensurePrivateBucket } from "./ensure-private-bucket";
import { env } from "./env";
import { fileUploadSchema } from "./file-upload-schema";
import prisma from "./prisma";
import { S3 } from "./s3-client";

export async function handlePresignedUrl(
  request: Request,
  session: { session: Session; user: any }
) {
  const body = await request.json();
  console.log("📦 Dados recebidos:", body);

  const validation = fileUploadSchema.safeParse(body);

  if (!validation.success) {
    console.log("❌ Validação falhou:", validation.error);
    return NextResponse.json(
      { error: "Invalid Request Body", details: validation.error },
      { status: 400 }
    );
  }

  const {
    fileName,
    contentType,
    size,
    fileType,
    fileExtension,
    description,
    tags,
    courseId,
    tempUpload,
  } = validation.data;

  console.log("✅ Dados validados:", {
    fileName,
    contentType,
    size,
    fileType,
    courseId,
    tempUpload,
  });

  // Verificar configuração
  if (!env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME) {
    console.error("❌ AWS_S3_BUCKET_NAME não configurado");
    return NextResponse.json(
      { error: "Configuração AWS não encontrada" },
      { status: 500 }
    );
  }

  // Usar bucket privado para uploads
  const privateBucketName =
    `${env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}-private` || "kudondza-private";
  console.log("🪣 Usando bucket privado para uploads:", privateBucketName);

  // Verificar/criar bucket privado
  await ensurePrivateBucket(privateBucketName);

  const uniqueKey = `${v4()}-${fileName}`;
  console.log("🔑 Chave única gerada:", uniqueKey);

  const command = new PutObjectCommand({
    Bucket: privateBucketName,
    ContentType: contentType,
    ContentLength: size,
    Key: uniqueKey,
  });

  console.log("📤 Gerando URL pré-assinada para upload...");
  const presignedUrl = await getSignedUrl(S3, command, {
    expiresIn: 3600, // 1 hora para upload
  });

  console.log("✅ URL pré-assinada gerada");

  // URL interna do arquivo
  const fileUrl = `${env.AWS_ENDPOINT_URL_S3}/${privateBucketName}/${uniqueKey}`;

  console.log("💾 Salvando metadados no banco...");
  const fileUpload = await prisma.fileUpload.create({
    data: {
      fileName,
      fileKey: uniqueKey,
      fileUrl,
      fileType,
      fileSize: size,
      contentType,
      fileExtension,
      description: description || null,
      tags: tags || [],
      uploadStatus: "PENDING",
      userId: session.user.id,
      courseId: courseId || null,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      tempUpload: tempUpload || false,
    },
  });

  console.log("✅ Metadados salvos, ID:", fileUpload.id);

  return NextResponse.json({
    success: true,
    message: "Arquivo validado com sucesso",
    presignedUrl,
    key: uniqueKey,
    fileUrl,
    fileUploadId: fileUpload.id,
  });
}
