import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { env } from "./env";
import prisma from "./prisma";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  baseURL: env.BETTER_AUTH_URL,
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "Kudondza <onboarding@resend.dev>",
          to: [email],
          subject: "Kudondza - Seu código de verificação",
          html: `
            <!DOCTYPE html>
            <html lang="pt">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Kudondza - Código de Verificação</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #faf9f5; font-family: 'DM Mono', 'Courier New', monospace; line-height: 1.6; color: #3d3929;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #c96442 0%, #d97757 100%); padding: 32px 24px; text-align: center;">
                  <div style="display: inline-block; margin-bottom: 16px;">
                    <img src="https://kudondza-v1.vercel.app/Kudondza.png" alt="Kudondza" width="48" height="48" style="display: block; border-radius: 4px;">
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">Kudondza</h1>
                  <p style="margin: 8px 0 0 0; color: #ffffff; opacity: 0.9; font-size: 16px;">Eleve sua experiência de aprendizado</p>
                </div>

                <!-- Content -->
                <div style="padding: 40px 24px;">
                  <h2 style="margin: 0 0 24px 0; color: #3d3929; font-size: 24px; font-weight: bold; text-align: center;">
                    Código de Verificação
                  </h2>

                  <p style="margin: 0 0 24px 0; color: #535146; font-size: 16px; text-align: center;">
                    Use o código abaixo para fazer login na sua conta Kudondza:
                  </p>

                  <!-- OTP Code -->
                  <div style="text-align: center; margin: 32px 0;">
                    <div style="display: inline-block; background-color: #e9e6dc; border: 2px solid #c96442; border-radius: 8px; padding: 20px 32px;">
                      <span style="font-size: 32px; font-weight: bold; color: #c96442; letter-spacing: 8px; font-family: 'DM Mono', 'Courier New', monospace;">${otp}</span>
                    </div>
                  </div>

                  <div style="background-color: #ede9de; border-radius: 8px; padding: 16px; margin: 24px 0;">
                    <p style="margin: 0; color: #83827d; font-size: 14px; text-align: center;">
                      <strong>Importante:</strong> Este código expira em 10 minutos por motivos de segurança.
                    </p>
                  </div>

                  <p style="margin: 24px 0 0 0; color: #83827d; font-size: 14px; text-align: center;">
                    Se você não solicitou este código, ignore este email. Sua conta permanecerá segura.
                  </p>
                </div>

                <!-- Footer -->
                <div style="background-color: #f5f4ee; padding: 24px; text-align: center; border-top: 1px solid #dad9d4;">
                  <p style="margin: 0 0 8px 0; color: #3d3d3a; font-size: 14px; font-weight: bold;">
                    Kudondza
                  </p>
                  <p style="margin: 0; color: #83827d; font-size: 12px;">
                    O futuro da Educação Online em Moçambique
                  </p>
                  <div style="margin-top: 16px;">
                    <a href="https://kudondza.com" style="color: #c96442; text-decoration: none; font-size: 12px; margin: 0 8px;">Website</a>
                    <span style="color: #dad9d4;">|</span>
                    <a href="mailto:suporte@kudondza.com" style="color: #c96442; text-decoration: none; font-size: 12px; margin: 0 8px;">Suporte</a>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        });
      },
    }),
  ],
});
