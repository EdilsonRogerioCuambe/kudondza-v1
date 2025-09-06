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
      // Usa configuração padrão do Gmail para evitar conflitos de TLS/port
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    } else {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE, // true para 465, false para 587 (STARTTLS)
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
        requireTLS: !env.SMTP_SECURE,
        tls: {
          minVersion: "TLSv1.2",
          servername: env.SMTP_HOST,
        },
      });
    }
  }

  async sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
  }) {
    try {
      const mailOptions = {
        from: options.from || `Kudondza <${env.SMTP_FROM_EMAIL}>`,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        html: options.html,
      };

      console.log("📧 Enviando email com opções:");
      console.log("📧 From:", mailOptions.from);
      console.log("📧 To:", mailOptions.to);
      console.log("📧 Subject:", mailOptions.subject);
      console.log("📧 SMTP User:", env.SMTP_USER);

      const info = await this.transporter.sendMail(mailOptions);

      console.log("📧 Email enviado via SMTP:");
      console.log("📧 Message ID:", info.messageId);
      console.log("📧 Response:", info.response);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("❌ Erro ao enviar email via SMTP:", error);
      return { success: false };
    }
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
