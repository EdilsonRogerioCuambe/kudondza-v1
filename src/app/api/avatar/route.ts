import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { S3 } from "@/lib/s3-client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "URL da imagem é obrigatória" },
        { status: 400 }
      );
    }

    // Verificar se é uma URL do nosso bucket
    const bucketUrl = `https://${env.NEXT_PUBLIC_R2_BUCKET_NAME}.r2.cloudflarestorage.com`;
    if (!imageUrl.startsWith(bucketUrl)) {
      // Se não for do nosso bucket, retornar a URL original
      return NextResponse.json({
        success: true,
        imageUrl,
        isExternal: true,
      });
    }

    // Extrair a chave do arquivo da URL
    const key = imageUrl.replace(`${bucketUrl}/`, "");

    // Gerar presigned URL
    const getObjectCommand = new GetObjectCommand({
      Bucket: env.NEXT_PUBLIC_R2_BUCKET_NAME,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(S3, getObjectCommand, {
      expiresIn: 7 * 24 * 60 * 60, // 7 dias
    });

    return NextResponse.json({
      success: true,
      imageUrl: presignedUrl,
      isExternal: false,
      expiresIn: "7 days",
    });
  } catch (error) {
    console.error("Erro ao gerar presigned URL:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
