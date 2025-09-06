"use server";

import prisma from "@/lib/prisma";

export interface CreateResourceInput {
  title: string;
  description?: string;
  type: "PDF" | "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | "LINK" | "CODE";
  url: string;
  fileSize?: number;
  mimeType?: string;
  downloadable?: boolean;
  lessonId: string;
}

export interface UpdateResourceInput {
  title?: string;
  description?: string;
  type?: "PDF" | "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | "LINK" | "CODE";
  url?: string;
  fileSize?: number;
  mimeType?: string;
  downloadable?: boolean;
}

export async function createResource(data: CreateResourceInput) {
  try {
    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        url: data.url,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        downloadable: data.downloadable ?? true,
        lessonId: data.lessonId,
      },
    });

    return { success: true, data: resource };
  } catch (error) {
    console.error("Erro ao criar resource:", error);
    return { success: false, error: "Erro ao criar resource" };
  }
}

export async function updateResource(resourceId: string, data: UpdateResourceInput) {
  try {
    const resource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        url: data.url,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        downloadable: data.downloadable,
      },
    });

    return { success: true, data: resource };
  } catch (error) {
    console.error("Erro ao atualizar resource:", error);
    return { success: false, error: "Erro ao atualizar resource" };
  }
}

export async function deleteResource(resourceId: string) {
  try {
    await prisma.resource.delete({
      where: { id: resourceId },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar resource:", error);
    return { success: false, error: "Erro ao deletar resource" };
  }
}

export async function getResourcesByLesson(lessonId: string) {
  try {
    const resources = await prisma.resource.findMany({
      where: { lessonId },
      orderBy: { createdAt: "asc" },
    });

    return { success: true, data: resources };
  } catch (error) {
    console.error("Erro ao buscar resources:", error);
    return { success: false, error: "Erro ao buscar resources" };
  }
}
