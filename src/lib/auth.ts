import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
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
          from: "DONDZA <onboarding@resend.dev>",
          to: [email],
          subject: "DONDZA - Seu código de verificação",
          html: `<div style="font-family: sans-serif; line-height: 1.5; color: #333;">
            <h1 style="color: #4A90E2;">Seu código de verificação</h1>
            <p>Use o código abaixo para fazer login na sua conta:</p>
            <h2 style="background: #f4f4f4; padding: 10px; border-radius: 5px; display: inline-block;">${otp}</h2>
            <p style="font-size: 0.9em; color: #777;">Se você não solicitou este código, ignore este email.</p>
          </div>`,
        });
      },
    }),
  ],
});
