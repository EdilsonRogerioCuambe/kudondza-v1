import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    // Verificar autenticação
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // Buscar assinatura ativa para o curso
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: {
          in: ["ACTIVE", "TRIALING"],
        },
        metadata: {
          path: ["courseId"],
          equals: courseId,
        },
      },
      select: {
        id: true,
        status: true,
        currentPeriodEnd: true,
        trialEnd: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error("Error checking course subscription:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
