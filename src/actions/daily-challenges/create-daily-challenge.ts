"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const CreateDailyChallengeSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.enum([
    "STUDY_TIME",
    "EXERCISE_COMPLETION",
    "LOGIN_STREAK",
    "COURSE_COMPLETION",
    "LESSON_COMPLETION",
    "QUIZ_COMPLETION",
    "PROJECT_SUBMISSION",
    "SOCIAL_INTERACTION"
  ]),
  target: z.coerce.number().int().min(1),
  reward: z.coerce.number().int().min(0),
  isActive: z.coerce.boolean().default(true),
  isRecurring: z.coerce.boolean().default(true),
  expiresAt: z.string().datetime().nullable().optional(),
});

export async function createDailyChallenge(formData: FormData) {
  try {
    const parsed = CreateDailyChallengeSchema.parse({
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      type: formData.get("type"),
      target: formData.get("target"),
      reward: formData.get("reward"),
      isActive: formData.get("isActive") ?? "true",
      isRecurring: formData.get("isRecurring") ?? "true",
      expiresAt: (formData.get("expiresAt") as string) || undefined,
    });

    const created = await prisma.dailyChallenge.create({
      data: {
        title: parsed.title,
        description: parsed.description ?? null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: parsed.type as any,
        target: parsed.target,
        reward: parsed.reward,
        isActive: parsed.isActive,
        isRecurring: parsed.isRecurring,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
      },
    });

    return { success: true, data: created } as const;
  } catch (error) {
    console.error("Erro ao criar desafio diário:", error);
    return { success: false, error: "Erro ao criar desafio" } as const;
  }
}
