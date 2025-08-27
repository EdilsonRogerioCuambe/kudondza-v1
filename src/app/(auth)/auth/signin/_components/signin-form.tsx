"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Mail, Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const [isGithubPending, setIsGithubPending] = useTransition();
  const [isEmailPending, setIsEmailPending] = useTransition();
  const [email, setEmail] = useState("");

  async function signInWithGithub() {
    setIsGithubPending(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Login bem-sucedido de volta!");
          },
          onError: (error) => {
            toast.error(`Erro ao fazer login: ${error.error.message}`);
          },
        },
      });
    });
  }

  function signInWithEmail() {
    setIsEmailPending(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Código de verificação enviado para seu email!");
            router.push("/auth/verify-otp?email=" + encodeURIComponent(email));
          },
          onError: (error) => {
            toast.error(`Erro ao enviar código: ${error.error.message}`);
          },
        },
      });
    });
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Bem-vindo de volta!
        </CardTitle>
        <CardDescription className="text-center">
          Entre com sua conta do GitHub ou email
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={signInWithGithub}
          disabled={isGithubPending}
        >
          {isGithubPending ? (
            <>
              <Loader className="animate-spin h-4 w-4" />
              Entrando...
            </>
          ) : (
            <>
              <Github className="h-4 w-4 mr-2" />
              Entrar com GitHub
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continue com email
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          onClick={signInWithEmail}
          disabled={isEmailPending || !email}
        >
          {isEmailPending ? (
            <>
              <Loader className="animate-spin h-4 w-4 mr-2" />
              Entrando...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Entrar com Email
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
