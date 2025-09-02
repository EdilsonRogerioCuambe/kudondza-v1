"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const UpdateDailyChallengeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  type: z
    .enum([
      "STUDY_TIME",
      "EXERCISE_COMPLETION",
      "LOGIN_STREAK",
      "COURSE_COMPLETION",
      "LESSON_COMPLETION",
      "QUIZ_COMPLETION",
      "PROJECT_SUBMISSION",
      "SOCIAL_INTERACTION",
    ])
    .optional(),
  target: z.coerce.number().int().min(1).optional(),
  reward: z.coerce.number().int().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
  isRecurring: z.coerce.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
});

export async function updateDailyChallenge(formData: FormData) {
  try {
    const parsed = UpdateDailyChallengeSchema.parse({
      id: formData.get("id"),
      title: formData.get("title") || undefined,
      description: formData.get("description") || undefined,
      type: formData.get("type") || undefined,
      target: formData.get("target") || undefined,
      reward: formData.get("reward") || undefined,
      isActive: formData.get("isActive") ?? undefined,
      isRecurring: formData.get("isRecurring") ?? undefined,
      expiresAt: (formData.get("expiresAt") as string) || undefined,
    });

    const updated = await prisma.dailyChallenge.update({
      where: { id: parsed.id },
      data: {
        ...(parsed.title && { title: parsed.title }),
        ...(parsed.description !== undefined && {
          description: parsed.description,
        }),
        ...(parsed.type && { type: parsed.type }),
        ...(parsed.target !== undefined && { target: parsed.target }),
        ...(parsed.reward !== undefined && { reward: parsed.reward }),
        ...(parsed.isActive !== undefined && { isActive: parsed.isActive }),
        ...(parsed.isRecurring !== undefined && {
          isRecurring: parsed.isRecurring,
        }),
        ...(parsed.expiresAt !== undefined && {
          expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
        }),
      },
    });

    return { success: true, data: updated } as const;
  } catch (error) {
    console.error("Erro ao atualizar desafio diário:", error);
    return { success: false, error: "Erro ao atualizar" } as const;
  }
}
