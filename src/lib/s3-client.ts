import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

console.log("🔧 Configurando cliente S3 para Tigris...");
console.log("📍 Região:", env.AWS_REGION);
console.log(
  "🔑 Access Key ID:",
  env.AWS_ACCESS_KEY_ID
    ? `${env.AWS_ACCESS_KEY_ID.substring(0, 8)}...`
    : "NÃO CONFIGURADO"
);
console.log(
  "🔑 Secret Access Key:",
  env.AWS_SECRET_ACCESS_KEY ? "CONFIGURADO" : "NÃO CONFIGURADO"
);
console.log("🌐 Endpoint Tigris:", env.AWS_ENDPOINT_URL_S3);

export const S3 = new S3Client({
  endpoint: env.AWS_ENDPOINT_URL_S3,
  region: env.AWS_REGION === "auto" ? "us-east-1" : env.AWS_REGION, // Tigris precisa de uma região válida
  forcePathStyle: true, // Tigris usa path-style URLs
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

console.log("✅ Cliente S3 configurado para Tigris com sucesso");
