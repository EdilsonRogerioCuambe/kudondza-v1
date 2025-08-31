"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  IconArrowLeft,
  IconCopy,
  IconMail,
  IconPlus,
  IconShare,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function InviteMembersPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [isLoading, setIsLoading] = useState(false);
  const [inviteMethod, setInviteMethod] = useState<"email" | "link">("email");
  const [emails, setEmails] = useState<string[]>([""]);
  const [message, setMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const addEmail = () => {
    setEmails([...emails, ""]);
  };

  const removeEmail = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSendInvites = async (e: React.FormEvent) => {
    e.preventDefault();

    const validEmails = emails.filter(
      (email) => email.trim() && email.includes("@")
    );

    if (validEmails.length === 0) {
      toast.error("Adicione pelo menos um email válido");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implementar action de envio de convites
      toast.success(`${validEmails.length} convite(s) enviado(s) com sucesso!`);

      // Limpar formulário
      setEmails([""]);
      setMessage("");
    } catch (error) {
      console.error("Erro ao enviar convites:", error);
      toast.error("Erro ao enviar convites");
    } finally {
      setIsLoading(false);
    }
  };

  const generateInviteLink = async () => {
    try {
      // TODO: Implementar geração de link de convite
      const link = `${window.location.origin}/admin/dashboard/communities/${slug}/join?invite=abc123`;
      setInviteLink(link);
      toast.success("Link de convite gerado!");
    } catch (error) {
      console.error("Erro ao gerar link:", error);
      toast.error("Erro ao gerar link de convite");
    }
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Link copiado para a área de transferência!");
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      toast.error("Erro ao copiar link");
    }
  };

  const shareInviteLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Convite para Comunidade",
          text: "Junte-se à nossa comunidade!",
          url: inviteLink,
        });
      } else {
        await copyInviteLink();
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      toast.error("Erro ao compartilhar link");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/admin/dashboard/communities/${slug}`}>
            <Button variant="ghost" size="sm">
              <IconArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Convidar Membros
            </h1>
            <p className="text-muted-foreground mt-1">
              Convide novos membros para sua comunidade
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Coluna Principal */}
        <div className="xl:col-span-2 space-y-6">
          {/* Método de Convite */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUsers className="h-5 w-5" />
                Método de Convite
              </CardTitle>
              <CardDescription>
                Escolha como deseja convidar novos membros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    inviteMethod === "email"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-muted hover:border-muted-foreground"
                  }`}
                  onClick={() => setInviteMethod("email")}
                >
                  <div className="flex items-center gap-3">
                    <IconMail className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Convite por Email</h3>
                      <p className="text-sm text-muted-foreground">
                        Envie convites diretos por email
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    inviteMethod === "link"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-muted hover:border-muted-foreground"
                  }`}
                  onClick={() => setInviteMethod("link")}
                >
                  <div className="flex items-center gap-3">
                    <IconShare className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Link de Convite</h3>
                      <p className="text-sm text-muted-foreground">
                        Compartilhe um link de convite
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Convite por Email */}
          {inviteMethod === "email" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconMail className="h-5 w-5" />
                  Convite por Email
                </CardTitle>
                <CardDescription>
                  Adicione os emails das pessoas que deseja convidar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendInvites} className="space-y-4">
                  <div className="space-y-3">
                    <Label>Emails dos Convidados</Label>
                    {emails.map((email, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => updateEmail(index, e.target.value)}
                          placeholder="email@exemplo.com"
                          className="flex-1"
                        />
                        {emails.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEmail(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <IconX className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addEmail}
                      className="w-full"
                    >
                      <IconPlus className="h-4 w-4 mr-2" />
                      Adicionar Email
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Mensagem Personalizada (Opcional)
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Adicione uma mensagem personalizada para os convites..."
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar Convites"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Link de Convite */}
          {inviteMethod === "link" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconShare className="h-5 w-5" />
                  Link de Convite
                </CardTitle>
                <CardDescription>
                  Gere um link que pode ser compartilhado com qualquer pessoa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!inviteLink ? (
                  <Button
                    onClick={generateInviteLink}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <IconPlus className="h-4 w-4 mr-2" />
                    Gerar Link de Convite
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Link de Convite</Label>
                      <div className="flex items-center gap-2">
                        <Input value={inviteLink} readOnly className="flex-1" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyInviteLink}
                        >
                          <IconCopy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={shareInviteLink}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <IconShare className="h-4 w-4 mr-2" />
                        Compartilhar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setInviteLink("")}
                      >
                        Gerar Novo Link
                      </Button>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Dica:</strong> Este link pode ser compartilhado
                        em redes sociais, grupos de WhatsApp, ou enviado por
                        qualquer meio de comunicação.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 order-first xl:order-last">
          {/* Dicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Convite por Email
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Ideal para convites direcionados e personalizados
                </p>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
                  Link de Convite
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Perfeito para compartilhamento em massa
                </p>
              </div>

              <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-1">
                  Limite de Membros
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Verifique se há espaço para novos membros
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Aprovação Automática</span>
                <span className="text-sm font-medium">Ativada</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Limite de Convites</span>
                <span className="text-sm font-medium">Ilimitado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Expiração do Link</span>
                <span className="text-sm font-medium">30 dias</span>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <CardHeader>
              <CardTitle className="text-lg">Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  router.push(`/admin/dashboard/communities/${slug}`)
                }
              >
                Voltar para Comunidade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
