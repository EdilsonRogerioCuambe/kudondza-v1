import { cancelSubscription } from "@/actions/subscriptions";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[API] /api/subscriptions/cancel called with body:", body);

    // Accept either subscriptionId directly, or resolve from courseId
    let { subscriptionId } = body as { subscriptionId?: string };
    const { courseId } = body as { courseId?: string };

    if (!subscriptionId) {
      // Resolve subscriptionId from courseId for the authenticated user
      const session = await auth.api.getSession({ headers: request.headers });
      console.log("[API] session user:", session?.user?.id);
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "Usuário não autenticado" },
          { status: 401 }
        );
      }
      if (!courseId) {
        return NextResponse.json(
          {
            error: "courseId é obrigatório quando subscriptionId não é enviado",
          },
          { status: 400 }
        );
      }

      // Find user's active/trialing subscription for this course
      const sub = await prisma.subscription.findFirst({
        where: {
          userId: session.user.id,
          status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
          metadata: {
            path: ["courseId"],
            equals: courseId,
          },
        },
        select: { id: true },
      });
      console.log("[API] Resolved subscription from courseId:", sub?.id);

      if (!sub?.id) {
        return NextResponse.json(
          { error: "Assinatura ativa não encontrada para este curso" },
          { status: 404 }
        );
      }

      subscriptionId = sub.id;
    }

    console.log("[API] Calling action cancelSubscription with:", {
      subscriptionId,
    });
    const result = await cancelSubscription({ subscriptionId });
    console.log("[API] cancelSubscription result:", result);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Erro na API de cancelamento de assinatura:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
