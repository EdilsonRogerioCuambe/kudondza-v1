"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function updateUserPreferences(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const preferences = {
      // Configurações de notificação
      notifications: {
        email: {
          courseUpdates: formData.get("email_courseUpdates") === "on",
          newMessages: formData.get("email_newMessages") === "on",
          systemAlerts: formData.get("email_systemAlerts") === "on",
          marketing: formData.get("email_marketing") === "on",
        },
        push: {
          courseUpdates: formData.get("push_courseUpdates") === "on",
          newMessages: formData.get("push_newMessages") === "on",
          systemAlerts: formData.get("push_systemAlerts") === "on",
          marketing: formData.get("push_marketing") === "on",
        },
        sms: {
          courseUpdates: formData.get("sms_courseUpdates") === "on",
          newMessages: formData.get("sms_newMessages") === "on",
          systemAlerts: formData.get("sms_systemAlerts") === "on",
          marketing: formData.get("sms_marketing") === "on",
        },
      },
      // Configurações de privacidade
      privacy: {
        profileVisibility:
          (formData.get("profileVisibility") as string) || "public",
        showEmail: formData.get("showEmail") === "on",
        showPhone: formData.get("showPhone") === "on",
        allowMessages: formData.get("allowMessages") === "on",
        showOnlineStatus: formData.get("showOnlineStatus") === "on",
        allowAnalytics: formData.get("allowAnalytics") === "on",
      },
      // Configurações de aparência
      appearance: {
        theme: (formData.get("theme") as string) || "system",
        language: (formData.get("language") as string) || "pt-BR",
        fontSize: (formData.get("fontSize") as string) || "medium",
        compactMode: formData.get("compactMode") === "on",
        showAnimations: formData.get("showAnimations") === "on",
      },
    };

    // Atualizar o usuário
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        preferences,
        theme: preferences.appearance.theme,
        language: preferences.appearance.language,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/dashboard/settings");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Erro ao atualizar preferências:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
