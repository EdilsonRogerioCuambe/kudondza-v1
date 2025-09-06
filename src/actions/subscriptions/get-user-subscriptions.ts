"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getUserSubscriptions() {
  try {
    // Verificar autenticação
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    // Buscar assinaturas do usuário
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        payments: {
          orderBy: {
            createdAt: "desc",
          },
          take: 3,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Buscar cursos relacionados para cada assinatura
    const subscriptionsWithCourses = await Promise.all(
      subscriptions.map(async (subscription) => {
        let course = null;
        if (
          subscription.metadata &&
          typeof subscription.metadata === "object" &&
          "courseId" in subscription.metadata
        ) {
          course = await prisma.course.findUnique({
            where: { id: subscription.metadata.courseId as string },
            select: {
              id: true,
              title: true,
              thumbnail: true,
              description: true,
              instructor: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          });
        }
        return {
          ...subscription,
          course,
        };
      })
    );

    return {
      success: true,
      data: subscriptionsWithCourses,
    };
  } catch (error) {
    console.error("Erro ao buscar assinaturas do usuário:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
