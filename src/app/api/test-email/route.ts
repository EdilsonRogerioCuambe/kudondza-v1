import { testEmailSystem } from "@/lib/test-email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Verificar se é um ambiente de desenvolvimento ou se tem autorização
    const isDevelopment = process.env.NODE_ENV === "development";
    const authHeader = request.headers.get("authorization");
    const expectedAuth = process.env.ADMIN_API_KEY;

    if (
      !isDevelopment &&
      (!authHeader || authHeader !== `Bearer ${expectedAuth}`)
    ) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    console.log("🧪 Iniciando teste do sistema de emails...");

    const result = await testEmailSystem();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Sistema de emails testado com sucesso!",
        results: result.results,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Erro no teste de emails:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
