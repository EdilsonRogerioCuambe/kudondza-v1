"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Nota: Este sistema usa emailOTP para autenticação, não senhas tradicionais
// A funcionalidade de alterar senha não é necessária
export async function updateUserPassword(_formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Como o sistema usa emailOTP, não há senhas para alterar
  return {
    success: false,
    error:
      "Este sistema usa autenticação por email (OTP), não senhas tradicionais. Para alterar sua conta, use a opção de redefinir email.",
  };
}

export async function toggleTwoFactorAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    // Por enquanto, apenas simular o toggle
    // Em uma implementação real, você integraria com um serviço de 2FA
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Simular toggle do 2FA
    const currentPreferences = user.preferences as Record<string, unknown>;
    const current2FA =
      (currentPreferences?.twoFactorEnabled as boolean) || false;

    const updatedPreferences = {
      ...currentPreferences,
      twoFactorEnabled: !current2FA,
    };

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        preferences: updatedPreferences,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/dashboard/settings");
    return {
      success: true,
      twoFactorEnabled: !current2FA,
      message: !current2FA ? "2FA ativado" : "2FA desativado",
    };
  } catch (error) {
    console.error("Erro ao alterar 2FA:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

export async function terminateOtherSessions() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    // Encerrar todas as sessões exceto a atual
    await prisma.session.deleteMany({
      where: {
        userId: session.user.id,
        NOT: { token: session.session.token },
      },
    });

    revalidatePath("/admin/dashboard/settings");
    return { success: true, message: "Outras sessões encerradas com sucesso" };
  } catch (error) {
    console.error("Erro ao encerrar sessões:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
