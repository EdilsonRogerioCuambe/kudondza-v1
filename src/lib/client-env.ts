// Configurações de ambiente para o lado do cliente
// Apenas variáveis NEXT_PUBLIC_* estão disponíveis aqui

export const clientEnv = {
  R2_DEV_URL:
    process.env.NEXT_PUBLIC_R2_DEV_URL ||
    "https://pub-8c05bd36a6e2402b86f528ea4bca59fe.r2.dev",
  R2_BUCKET_NAME: process.env.NEXT_PUBLIC_R2_BUCKET_NAME || "kudondza",
} as const;
