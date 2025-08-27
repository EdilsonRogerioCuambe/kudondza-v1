"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { toast } from "sonner";

function VerifyOtpContent() {
  const [otp, setOtp] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") as string;
  const isOtpValid = otp.length === 6;

  if (!email) {
    return (
      <Card className="w-full mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Email não fornecido
          </CardTitle>
          <CardDescription>
            Por favor, forneça um email válido para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Você pode tentar novamente ou entrar em contato com o suporte.
          </p>
        </CardContent>
      </Card>
    );
  }

  function handleVerify() {
    startTransition(async () => {
      await authClient.signIn.emailOtp({
        otp: otp,
        email: email,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Verificação bem-sucedida! Você está logado.");
            router.push("/");
          },
          onError: (error) => {
            toast.error(`Erro ao verificar OTP: ${error.error.message}`);
            console.error("Erro ao verificar OTP:", error);
          },
        },
      });
    });
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Por Favor Verifique Seu Email
        </CardTitle>
        <CardDescription>
          Um código de verificação foi enviado para o seu email. Por favor,
          verifique sua caixa de entrada e insira o código abaixo para
          continuar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <p className="mt-4 text-sm text-center text-muted-foreground">
          Digite o código de 6 dígitos enviado para seu email. Se você não
          recebeu o código, verifique sua caixa de spam ou solicite um novo
          código.
        </p>
        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={isPending || !isOtpValid}
        >
          {isPending ? (
            <>
              <Loader className="animate-spin h-4 w-4 mr-2" />
              Verificando...
            </>
          ) : (
            "Verificar código"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <Card className="w-full mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Carregando…</CardTitle>
            <CardDescription>Preparando verificação de código.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <Loader className="animate-spin h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
