import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, School } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      {" "}
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4",
        })}
      >
        <span className="sr-only">Voltar para a página inicial</span>
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="w-full max-w-sm flex-col gap-6 flex">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image
            src="/Kudondza.svg"
            alt="Kudondza"
            className="size-9 rounded"
            width={36}
            height={36}
            priority
          />
          <span className="text-2xl">Kudondza</span>
        </Link>
        {children}
        <div className="text-sm text-muted-foreground text-center mt-4">
          Ao fazer login, você concorda com nossos{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </div>
  );
}
