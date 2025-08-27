/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { handleDirectUpload } from "@/lib/handle-direct-upload";
import { handlePresignedUrl } from "@/lib/handle-presigned-url";
import prisma from "@/lib/prisma";
import { S3 } from "@/lib/s3-client";
import {
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("🚀 Iniciando upload de arquivo...");

    // Verificar autenticação
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.log("❌ Usuário não autenticado");
      return NextResponse.json(
        { error: "Unauthorized", message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    console.log("✅ Usuário autenticado:", session.user.id);

    // Verificar se é um upload direto ou apenas validação
    const contentType = request.headers.get("content-type");

    if (contentType && contentType.includes("multipart/form-data")) {
      // Upload direto do arquivo
      console.log("📁 Upload direto detectado");
      return await handleDirectUpload(request, session);
    } else {
      // Apenas validação e geração de presigned URL
      console.log("🔗 Apenas validação e presigned URL");
      return await handlePresignedUrl(request, session);
    }
  } catch (error) {
    console.error("❌ Erro na rota S3:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Função para gerar URL de acesso público (quando necessário)
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileUploadId = searchParams.get("fileUploadId");
    const action = searchParams.get("action"); // 'access' para gerar URL de acesso

    if (action === "access" && fileUploadId) {
      // Gerar URL de acesso temporário para arquivo específico
      const fileUpload = await prisma.fileUpload.findFirst({
        where: {
          id: fileUploadId,
          userId: session.user.id,
        },
      });

      if (!fileUpload) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      // Extrair bucket e key do fileUrl ou usar campos separados se tiver
      const bucketName =
        `${env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}-private` || "kudondza-private";

      const getObjectCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileUpload.fileKey,
      });

      const presignedUrl = await getSignedUrl(S3, getObjectCommand, {
        expiresIn: 24 * 60 * 60, // 24 horas
      });

      return NextResponse.json({
        success: true,
        presignedUrl,
        expiresIn: "24 hours",
      });
    }

    // Listagem de uploads (código original)
    const courseId = searchParams.get("courseId");
    const fileType = searchParams.get("fileType");
    const status = searchParams.get("status");

    const where: any = {
      userId: session.user.id,
    };

    if (courseId) where.courseId = courseId;
    if (fileType) where.fileType = fileType;
    if (status) where.uploadStatus = status;

    const fileUploads = await prisma.fileUpload.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        fileType: true,
        fileSize: true,
        contentType: true,
        fileExtension: true,
        uploadStatus: true,
        uploadedAt: true,
        createdAt: true,
        description: true,
        tags: true,
        courseId: true,
        tempUpload: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Uploads recuperados com sucesso",
      fileUploads,
      total: fileUploads.length,
    });
  } catch (error) {
    console.error("Erro ao processar GET:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Manter outros métodos (PUT, PATCH) inalterados
export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fileUploadId, status, error } = body;

    if (!fileUploadId) {
      return NextResponse.json(
        { error: "Missing fileUploadId" },
        { status: 400 }
      );
    }

    const updatedUpload = await prisma.fileUpload.update({
      where: {
        id: fileUploadId,
        userId: session.user.id,
      },
      data: {
        uploadStatus: status || "COMPLETED",
        uploadedAt: status === "COMPLETED" ? new Date() : null,
        ...(error && { description: error }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Status do upload atualizado",
      fileUpload: updatedUpload,
    });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fileUploadIds, courseId } = body;

    if (!fileUploadIds || !Array.isArray(fileUploadIds) || !courseId) {
      return NextResponse.json(
        { error: "Missing fileUploadIds or courseId" },
        { status: 400 }
      );
    }

    const updatedUploads = await prisma.fileUpload.updateMany({
      where: {
        id: { in: fileUploadIds },
        userId: session.user.id,
        tempUpload: true,
      },
      data: {
        courseId: courseId,
        tempUpload: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Arquivos conectados ao curso com sucesso",
      updatedCount: updatedUploads.count,
    });
  } catch (error) {
    console.error("Erro ao conectar arquivos:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Método para deletar arquivos
export async function DELETE(request: Request) {
  try {
    console.log("🗑️ Iniciando processo de exclusão de arquivo...");

    // Verificar autenticação
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.log("❌ Usuário não autenticado");
      return NextResponse.json(
        { error: "Unauthorized", message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    console.log("✅ Usuário autenticado:", session.user.id);

    // Obter o ID do arquivo a ser deletado
    const { searchParams } = new URL(request.url);
    const fileUploadId = searchParams.get("fileUploadId");

    if (!fileUploadId) {
      console.log("❌ ID do arquivo não fornecido");
      return NextResponse.json(
        {
          error: "Missing fileUploadId",
          message: "ID do arquivo é obrigatório",
        },
        { status: 400 }
      );
    }

    console.log("🔍 Buscando arquivo para deletar:", fileUploadId);

    // Buscar o arquivo no banco de dados
    const fileUpload = await prisma.fileUpload.findFirst({
      where: {
        id: fileUploadId,
        userId: session.user.id, // Garantir que o usuário só deleta seus próprios arquivos
      },
    });

    if (!fileUpload) {
      console.log("❌ Arquivo não encontrado ou usuário não tem permissão");
      return NextResponse.json(
        {
          error: "File not found",
          message: "Arquivo não encontrado ou sem permissão",
        },
        { status: 404 }
      );
    }

    console.log("📁 Arquivo encontrado:", {
      fileName: fileUpload.fileName,
      fileKey: fileUpload.fileKey,
      fileType: fileUpload.fileType,
    });

    // Verificar configuração do bucket
    if (!env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME) {
      console.error("❌ AWS_S3_BUCKET_NAME não configurado");
      return NextResponse.json(
        { error: "Configuração AWS não encontrada" },
        { status: 500 }
      );
    }

    // Usar bucket privado para exclusão
    const privateBucketName =
      `${env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}-private` || "kudondza-private";
    console.log("🪣 Usando bucket privado para exclusão:", privateBucketName);

    try {
      // Deletar arquivo do S3
      console.log("🗑️ Deletando arquivo do S3...");
      const deleteCommand = new DeleteObjectCommand({
        Bucket: privateBucketName,
        Key: fileUpload.fileKey,
      });

      await S3.send(deleteCommand);
      console.log("✅ Arquivo deletado do S3 com sucesso");

      // Deletar registro do banco de dados
      console.log("🗑️ Deletando registro do banco de dados...");
      await prisma.fileUpload.delete({
        where: {
          id: fileUploadId,
        },
      });

      console.log("✅ Registro deletado do banco de dados");

      return NextResponse.json({
        success: true,
        message: "Arquivo deletado com sucesso",
        deletedFile: {
          id: fileUpload.id,
          fileName: fileUpload.fileName,
          fileType: fileUpload.fileType,
        },
      });
    } catch (s3Error: any) {
      console.error("❌ Erro ao deletar arquivo do S3:", {
        name: s3Error.name,
        message: s3Error.message,
        bucket: privateBucketName,
        key: fileUpload.fileKey,
      });

      // Se o arquivo não existir no S3, apenas deletar do banco
      if (s3Error.name === "NoSuchKey") {
        console.log(
          "⚠️ Arquivo não encontrado no S3, deletando apenas do banco"
        );

        await prisma.fileUpload.delete({
          where: {
            id: fileUploadId,
          },
        });

        return NextResponse.json({
          success: true,
          message: "Arquivo deletado do banco (não encontrado no S3)",
          deletedFile: {
            id: fileUpload.id,
            fileName: fileUpload.fileName,
            fileType: fileUpload.fileType,
          },
        });
      }

      throw s3Error;
    }
  } catch (error) {
    console.error("❌ Erro ao deletar arquivo:", error);
    return NextResponse.json(
      {
        error: "Delete failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
