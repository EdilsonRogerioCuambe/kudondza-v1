import { getUserSubscriptions } from "@/actions/subscriptions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getUserSubscriptions();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Erro na API de assinaturas do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
