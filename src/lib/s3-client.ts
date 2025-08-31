import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

console.log("🔧 Configurando cliente S3 para Cloudflare R2...");
console.log("📍 Região:", env.R2_REGION);
console.log(
  "🔑 R2 Access Key ID:",
  env.R2_ACCESS_KEY_ID
    ? `${env.R2_ACCESS_KEY_ID.substring(0, 8)}...`
    : "NÃO CONFIGURADO"
);
console.log(
  "🔑 R2 Secret Access Key:",
  env.R2_SECRET_ACCESS_KEY ? "CONFIGURADO" : "NÃO CONFIGURADO"
);
console.log("🌐 Endpoint R2:", env.R2_ENDPOINT_URL);
console.log("🪣 Bucket R2:", env.R2_BUCKET_NAME);

export const S3 = new S3Client({
  endpoint: env.R2_ENDPOINT_URL,
  region: env.R2_REGION === "auto" ? "auto" : env.R2_REGION,
  forcePathStyle: false, // R2 usa virtual-hosted-style URLs
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

console.log("✅ Cliente S3 configurado para Cloudflare R2 com sucesso");
