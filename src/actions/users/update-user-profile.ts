"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function updateUserProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const website = formData.get("website") as string;
    const phone = formData.get("phone") as string;
    const image = formData.get("image") as string;

    console.log("📸 Update User Profile - Image URL:", image);

    // Validar dados obrigatórios
    if (!name || !email) {
      throw new Error("Nome e email são obrigatórios");
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Email inválido");
    }

    // Verificar se o email já está em uso por outro usuário
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: session.user.id },
      },
    });

    if (existingUser) {
      throw new Error("Este email já está em uso");
    }

    // Atualizar o usuário
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        bio: bio || null,
        location: location || null,
        website: website || null,
        phone: phone || null,
        image: image || null,
        updatedAt: new Date(),
      },
    });

    console.log("✅ User updated successfully with image:", updatedUser.image);

    revalidatePath("/admin/dashboard/settings");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
