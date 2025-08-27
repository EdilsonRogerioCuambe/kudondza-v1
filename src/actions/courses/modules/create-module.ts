"use server";

import prisma from "@/lib/prisma";
import { CreateModuleInput, CreateModuleSchema } from "@/lib/zod-schema";
import { revalidatePath } from "next/cache";

export async function createModule(data: CreateModuleInput) {
  try {
    const validated = CreateModuleSchema.parse(data);

    // calcular próxima ordem
    const last = await prisma.module.findFirst({
      where: { courseId: validated.courseId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const nextOrder = (last?.order ?? 0) + 1;

    const moduleData = await prisma.module.create({
      data: {
        courseId: validated.courseId,
        title: validated.title,
        slug: validated.slug || undefined,
        description: validated.description || undefined,
        isRequired: validated.isRequired,
        isPublic: validated.isPublic,
        xpReward: validated.xpReward,
        order: nextOrder,
      },
      select: {
        id: true,
        title: true,
        order: true,
        isPublic: true,
        isRequired: true,
      },
    });

    revalidatePath("/admin/dashboard/courses");
    return { success: true, data: moduleData } as const;
  } catch (error) {
    console.error("Erro ao criar módulo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao criar módulo",
    } as const;
  }
}
