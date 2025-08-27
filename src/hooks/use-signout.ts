"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Deslogado com sucesso!");
          router.push("/");
        },
        onError: (error) => {
          toast.error(`Erro ao deslogar: ${error.error.message}`);
          console.error("Erro ao deslogar:", error);
        },
      },
    });
  }

  return { handleSignOut };
}
