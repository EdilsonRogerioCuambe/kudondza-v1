import "server-only";

import nodemailer from "nodemailer";
import { env } from "./env";

// Interface para o serviço de email
interface EmailService {
  sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
  }): Promise<{ success: boolean; messageId?: string; previewUrl?: string }>;
}

// Implementação com SMTP real (produção)
class SMTPEmailService implements EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const isGmail = (env.SMTP_HOST || "")
      .toLowerCase()
      .includes("smtp.gmail.com");

    if (isGmail) {
      // Configuração otimizada para Gmail
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
        // Configurações de performance
        pool: true, // Usar pool de conexões
        maxConnections: 5, // Máximo de conexões simultâneas
        maxMessages: 100, // Máximo de mensagens por conexão
        rateDelta: 20000, // Intervalo entre envios (20s)
        rateLimit: 5, // Máximo 5 emails por rateDelta
        // Configurações de timeout
        connectionTimeout: 60000, // 60s para conectar
        greetingTimeout: 30000, // 30s para greeting
        socketTimeout: 60000, // 60s para socket
        // Configurações de TLS otimizadas
        tls: {
          rejectUnauthorized: false, // Para desenvolvimento
          minVersion: "TLSv1.2",
        },
      });
    } else {
      // Configuração otimizada para outros provedores SMTP
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE, // true para 465, false para 587 (STARTTLS)
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
        requireTLS: !env.SMTP_SECURE,

        // SPEED: keep connections warm & reuse them
        pool: true,
        maxConnections: 3, // 1–5 is typical for Gmail
        maxMessages: Infinity, // reuse forever
        // Optional gentle pacing so Gmail doesn’t frown:
        rateDelta: 1000, // window (ms)
        rateLimit: 5, // msgs per window (shared across connections)

        // OBSERVABILITY & STABILITY
        logger: true,
        debug: true,
        connectionTimeout: 20_000,
        greetingTimeout: 10_000,
        socketTimeout: 30_000,
        // Configurações de TLS otimizadas
        tls: {
          minVersion: "TLSv1.2",
          servername: env.SMTP_HOST,
          rejectUnauthorized: false, // Para desenvolvimento
        },
      });
    }

    // Verificar conexão na inicialização
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log("📧 Conexão SMTP verificada com sucesso");
    } catch (error) {
      console.error("❌ Erro na verificação da conexão SMTP:", error);
    }
  }

  async sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
  }) {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const mailOptions = {
          from: options.from || `Kudondza <${env.SMTP_FROM_EMAIL}>`,
          to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
          subject: options.subject,
          html: options.html,
          // Configurações adicionais para melhor entrega
          headers: {
            "X-Priority": "1", // Alta prioridade
            "X-MSMail-Priority": "High",
            Importance: "high",
          },
        };

        console.log(`📧 Tentativa ${attempt}/${maxRetries} - Enviando email:`);
        console.log("📧 From:", mailOptions.from);
        console.log("📧 To:", mailOptions.to);
        console.log("📧 Subject:", mailOptions.subject);

        const startTime = Date.now();
        const info = await this.transporter.sendMail(mailOptions);
        const endTime = Date.now();

        console.log(
          `📧 ✅ Email enviado com sucesso em ${endTime - startTime}ms:`
        );
        console.log("📧 Message ID:", info.messageId);
        console.log("📧 Response:", info.response);

        return {
          success: true,
          messageId: info.messageId,
        };
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ Tentativa ${attempt}/${maxRetries} falhou:`, error);

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Backoff exponencial
          console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    console.error("❌ Todas as tentativas de envio falharam:", lastError);
    return {
      success: false,
      error: lastError?.message || "Erro desconhecido",
    };
  }
}

// Factory para escolher o serviço baseado no ambiente
function createEmailService(): EmailService {
  console.log("📧 Usando SMTP Email Service (Gmail) em todos os ambientes");
  return new SMTPEmailService();
}

// Instância singleton do serviço de email
export const emailService = createEmailService();

// Função helper para envio de emails
export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  return emailService.sendEmail(options);
}

// Interface para notificações de email
interface EmailNotificationOptions {
  type: string;
  recipient: string;
  subject: string;
  content: string;
  template?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>;
}

// Função para envio de notificações de email
export async function sendEmailNotification(options: EmailNotificationOptions) {
  try {
    const {
      recipient,
      subject,
      content,
      template: _template,
      variables: _variables = {},
    } = options;

    // Template básico de email
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Kudondza</h1>
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              <p>Este é um email automático, por favor não responda.</p>
              <p>© 2024 Kudondza. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await sendEmail({
      to: recipient,
      subject,
      html,
    });
  } catch (error) {
    console.error("Erro ao enviar notificação de email:", error);
    return { success: false };
  }
}
