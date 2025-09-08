import "server-only";

import { sendEmail } from "./email-service";

// Função para testar o envio de emails
export async function testEmailSystem() {
  try {
    console.log("🧪 Testando sistema de emails...");

    // Teste 1: Email de confirmação de pagamento
    const result1 = await sendEmail({
      to: "test@example.com",
      subject: "✅ Teste - Pagamento Confirmado",
      html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Teste - Pagamento Confirmado</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #faf9f5; font-family: 'DM Mono', 'Courier New', monospace; line-height: 1.6; color: #3d3929;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #c96442 0%, #d97757 100%); padding: 32px 24px; text-align: center;">
              <div style="display: inline-block; margin-bottom: 16px;">
                <img src="https://kudondza-v1.vercel.app/Kudondza.png" alt="Kudondza" width="48" height="48" style="display: block; border-radius: 4px;">
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">Kudondza</h1>
              <p style="margin: 8px 0 0 0; color: #ffffff; opacity: 0.9; font-size: 16px;">Teste do Sistema de Emails</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 24px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; background-color: #10b981; color: white; padding: 16px 24px; border-radius: 50%; font-size: 24px; margin-bottom: 16px;">
                  ✅
                </div>
                <h2 style="margin: 0 0 16px 0; color: #3d3929; font-size: 24px; font-weight: bold;">
                  Teste de Email - Sucesso!
                </h2>
                <p style="margin: 0; color: #535146; font-size: 16px;">
                  Este é um email de teste para verificar se o sistema está funcionando corretamente.
                </p>
              </div>

              <div style="background-color: #f0f9ff; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid #10b981;">
                <h3 style="margin: 0 0 16px 0; color: #3d3929; font-size: 18px;">Detalhes do Teste:</h3>
                <p style="margin: 8px 0; color: #535146;"><strong>Data/Hora:</strong> ${new Date().toLocaleString(
                  "pt-BR"
                )}</p>
                <p style="margin: 8px 0; color: #535146;"><strong>Status:</strong> ✅ Sistema Funcionando</p>
                <p style="margin: 8px 0; color: #535146;"><strong>Tipo:</strong> Email de Confirmação</p>
              </div>

              <div style="background-color: #ede9de; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; color: #3d3929; font-size: 18px;">🎉 Sistema de Emails Ativo!</h3>
                <p style="margin: 0 0 12px 0; color: #535146;">
                  O sistema de emails está funcionando corretamente. Agora você receberá notificações quando:
                </p>
                <ul style="margin: 12px 0; padding-left: 20px; color: #535146;">
                  <li>✅ Fizer uma inscrição em um curso</li>
                  <li>✅ Seu pagamento for confirmado</li>
                  <li>⚠️ Houver problemas com pagamento</li>
                  <li>📧 Receber códigos de verificação</li>
                </ul>
              </div>

              <p style="margin: 24px 0 0 0; color: #83827d; font-size: 14px; text-align: center;">
                Este é um email de teste automático do sistema.
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f5f4ee; padding: 24px; text-align: center; border-top: 1px solid #dad9d4;">
              <p style="margin: 0 0 8px 0; color: #3d3d3a; font-size: 14px; font-weight: bold;">
                Kudondza - Sistema de Emails
              </p>
              <p style="margin: 0; color: #83827d; font-size: 12px;">
                O futuro da Educação Online em Moçambique
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("📧 Resultado do teste de email de sucesso:", result1);

    // Teste 2: Email de erro
    const result2 = await sendEmail({
      to: "admin@kudondza.com",
      subject: "🚨 Teste - Email de Erro",
      html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Teste - Email de Erro</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #faf9f5; font-family: 'DM Mono', 'Courier New', monospace; line-height: 1.6; color: #3d3929;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 32px 24px; text-align: center;">
              <div style="display: inline-block; margin-bottom: 16px;">
                <img src="https://kudondza-v1.vercel.app/Kudondza.png" alt="Kudondza" width="48" height="48" style="display: block; border-radius: 4px;">
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">Kudondza</h1>
              <p style="margin: 8px 0 0 0; color: #ffffff; opacity: 0.9; font-size: 16px;">Teste do Sistema de Monitoramento</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 24px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; background-color: #ef4444; color: white; padding: 16px 24px; border-radius: 50%; font-size: 24px; margin-bottom: 16px;">
                  🚨
                </div>
                <h2 style="margin: 0 0 16px 0; color: #3d3929; font-size: 24px; font-weight: bold;">
                  Teste de Email de Erro
                </h2>
                <p style="margin: 0; color: #535146; font-size: 16px;">
                  Este é um email de teste para verificar se o sistema de monitoramento está funcionando.
                </p>
              </div>

              <div style="background-color: #fef2f2; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid #ef4444;">
                <h3 style="margin: 0 0 16px 0; color: #3d3929; font-size: 18px;">Detalhes do Teste:</h3>
                <p style="margin: 8px 0; color: #535146;"><strong>Data/Hora:</strong> ${new Date().toLocaleString(
                  "pt-BR"
                )}</p>
                <p style="margin: 8px 0; color: #535146;"><strong>Status:</strong> ✅ Sistema de Monitoramento Ativo</p>
                <p style="margin: 8px 0; color: #535146;"><strong>Tipo:</strong> Email de Erro/Admin</p>
              </div>

              <div style="background-color: #ede9de; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; color: #3d3929; font-size: 18px;">🔧 Sistema de Monitoramento Ativo!</h3>
                <p style="margin: 0 0 12px 0; color: #535146;">
                  O sistema de monitoramento está funcionando corretamente. Você receberá notificações quando:
                </p>
                <ul style="margin: 12px 0; padding-left: 20px; color: #535146;">
                  <li>🚨 Houver erros no processamento de pagamentos</li>
                  <li>⚠️ Falhas na criação de assinaturas</li>
                  <li>❌ Problemas com webhooks do Stripe</li>
                  <li>🔧 Erros gerais do sistema</li>
                </ul>
              </div>

              <p style="margin: 24px 0 0 0; color: #83827d; font-size: 14px; text-align: center;">
                Este é um email de teste automático do sistema de monitoramento.
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f5f4ee; padding: 24px; text-align: center; border-top: 1px solid #dad9d4;">
              <p style="margin: 0 0 8px 0; color: #3d3d3a; font-size: 14px; font-weight: bold;">
                Kudondza - Sistema de Monitoramento
              </p>
              <p style="margin: 0; color: #83827d; font-size: 12px;">
                O futuro da Educação Online em Moçambique
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("📧 Resultado do teste de email de erro:", result2);

    return {
      success: true,
      results: {
        successEmail: result1,
        errorEmail: result2,
      },
    };
  } catch (error) {
    console.error("❌ Erro no teste do sistema de emails:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
