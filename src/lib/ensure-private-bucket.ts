import { CreateBucketCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { S3 } from "./s3-client";

// Função para verificar/criar bucket privado
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
      console.log("📦 Criando bucket privado:", bucketName);

      try {
        // Criar bucket privado (sem ACL public-read)
        await S3.send(
          new CreateBucketCommand({
            Bucket: bucketName,
          })
        );

        console.log("✅ Bucket privado criado com sucesso:", bucketName);
        return { success: true, bucketName };
      } catch (createError: unknown) {
        const createAwsError = createError as Error;
        console.error("❌ Erro ao criar bucket:", createAwsError.message);
        throw createAwsError;
      }
    } else {
      console.error("❌ Erro ao verificar bucket:", awsError.message);
      throw awsError;
    }
  }
}
