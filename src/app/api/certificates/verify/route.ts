import { verifyCertificate } from "@/actions/certificates";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { verificationCode } = body;

    if (!verificationCode) {
      return NextResponse.json(
        {
          success: false,
          error: "Código de verificação é obrigatório",
        },
        { status: 400 }
      );
    }

    const result = await verifyCertificate(verificationCode);

    if (result.isValid && result.certificate) {
      return NextResponse.json({
        success: true,
        data: {
          certificate: result.certificate,
          isValid: true,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        data: {
          isValid: false,
          message: result.message,
        },
      });
    }
  } catch (error) {
    console.error("Erro ao verificar certificado:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao verificar certificado",
      },
      { status: 500 }
    );
  }
}
