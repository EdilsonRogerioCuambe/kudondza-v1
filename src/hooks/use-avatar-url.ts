import { clientEnv } from "@/lib/client-env";
import { useEffect, useState } from "react";

export function useAvatarUrl(originalUrl?: string | null) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!originalUrl) {
      setAvatarUrl(null);
      return;
    }

    // Se for URL pública do R2 dev, usar diretamente
    if (originalUrl.includes("r2.dev")) {
      setAvatarUrl(originalUrl);
      return;
    }

    // Se for uma URL externa, usar diretamente
    if (!originalUrl.includes("r2.cloudflarestorage.com")) {
      setAvatarUrl(originalUrl);
      return;
    }

    // Para URLs do nosso bucket privado, converter para URL pública do R2 dev
    if (originalUrl.includes("r2.cloudflarestorage.com")) {
      // Extrair apenas o nome do arquivo da URL
      const fileName = originalUrl.split("/").pop();
      if (fileName) {
        // Usar URL pública do R2 dev
        const publicUrl = `${clientEnv.R2_DEV_URL}/${fileName}`;
        setAvatarUrl(publicUrl);
      } else {
        // Fallback para URL original
        setAvatarUrl(originalUrl);
      }
    } else {
      // Se for externa, usar diretamente
      setAvatarUrl(originalUrl);
    }
  }, [originalUrl]);

  return { avatarUrl, isLoading: false };
}
