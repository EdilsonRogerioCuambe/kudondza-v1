import { HeadBucketCommand } from "@aws-sdk/client-s3";
import { S3 } from "./s3-client";

// Função para verificar se bucket privado existe
export async function ensurePrivateBucket(bucketName: string) {
  try {
    console.log("🔍 Verificando se bucket privado existe:", bucketName);

    // Tentar fazer um head do bucket
    await S3.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log("✅ Bucket privado existe:", bucketName);
    return { success: true, bucketName };
  } catch (error: unknown) {
    const awsError = error as Error & {
      $metadata?: { httpStatusCode?: number };
    };

    if (
      awsError.name === "NotFound" ||
      awsError.$metadata?.httpStatusCode === 404
    ) {
      console.error("❌ Bucket privado não encontrado:", bucketName);
      console.log("💡 Crie o bucket manualmente no Cloudflare Dashboard:");
      console.log("   1. Acesse: https://dash.cloudflare.com");
      console.log("   2. Vá para R2 Object Storage");
      console.log("   3. Clique em 'Create bucket'");
      console.log("   4. Nome:", bucketName);
      console.log("   5. Localização: Leste da América do Norte (ENAM)");

      throw new Error(
        `Bucket ${bucketName} não existe. Crie-o manualmente no Cloudflare Dashboard.`
      );
    } else {
      console.error("❌ Erro ao verificar bucket:", awsError.message);
      throw awsError;
    }
  }
}
