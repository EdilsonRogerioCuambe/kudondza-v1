import { getCertificate, updateCertificate } from "@/actions/certificates";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: certificateId } = await params;

    // Buscar certificado
    const certificate = await getCertificate(certificateId);

    // Aqui você implementaria a lógica de geração do PDF
    // Por exemplo, usando uma biblioteca como puppeteer ou jsPDF
    // Por enquanto, vamos simular a geração

    // Simular URL do PDF gerado
    const pdfUrl = `https://example.com/certificates/${certificate.certificateNumber}.pdf`;

    // Atualizar certificado com a URL do PDF
    await updateCertificate(certificateId, {
      certificateUrl: pdfUrl,
    });

    return NextResponse.json({
      success: true,
      data: {
        certificateUrl: pdfUrl,
        message: "PDF gerado com sucesso",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao gerar PDF do certificado",
      },
      { status: 500 }
    );
  }
}
