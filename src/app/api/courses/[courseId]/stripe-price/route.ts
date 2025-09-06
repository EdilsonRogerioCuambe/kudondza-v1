import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { courseId } = await params;
    const { isRecurring = true, interval = "month" } = await request.json();

    // Buscar o curso no banco
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
        stripePriceId: true,
        stripeProductId: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 }
      );
    }

    // Se já existe um preço Stripe para este curso, usar ele
    if (course.stripePriceId) {
      return NextResponse.json({ priceId: course.stripePriceId });
    }

    // Criar produto no Stripe se não existir
    let productId = course.stripeProductId;
    if (!productId) {
      const product = await stripe.products.create({
        name: course.title,
        description: `Acesso recorrente ao curso: ${course.title}`,
        metadata: {
          courseId: course.id,
          type: "course_subscription",
        },
      });
      productId = product.id;

      // Salvar o product ID no banco
      await prisma.course.update({
        where: { id: courseId },
        data: { stripeProductId: productId },
      });
    }

    // Criar preço recorrente no Stripe
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: Math.round(Number(course.price) * 100), // Converter para centavos
      currency: course.currency.toLowerCase(),
      recurring: isRecurring
        ? {
            interval: interval as "month" | "year",
          }
        : undefined,
      metadata: {
        courseId: course.id,
        type: "course_subscription",
      },
    });

    // Salvar o price ID no banco
    await prisma.course.update({
      where: { id: courseId },
      data: { stripePriceId: price.id },
    });

    return NextResponse.json({ priceId: price.id });
  } catch (error) {
    console.error("Erro ao criar preço Stripe:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
