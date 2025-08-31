"use client";

import { verifyCertificate } from "@/actions/certificates";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  IconAward,
  IconCheck,
  IconCopy,
  IconDownload,
  IconFileText,
  IconSearch,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Certificate {
  id: string;
  certificateNumber: string;
  verificationCode: string;
  title: string;
  description: string | null;
  templateData: unknown;
  certificateUrl: string | null;
  isValid: boolean;
  validUntil: Date | null;
  issuedAt: Date;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
  };
}

export default function VerifyCertificatePage() {
  const params = useParams();
  const _router = useRouter();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [searched, setSearched] = useState(false);

  const codeFromUrl = params.code as string;

  // Verificar certificado da URL
  useEffect(() => {
    if (codeFromUrl && codeFromUrl !== "[code]") {
      setVerificationCode(codeFromUrl);
      verifyCertificateCode(codeFromUrl);
    }
  }, [codeFromUrl]);

  // Verificar certificado
  const verifyCertificateCode = async (code: string) => {
    if (!code.trim()) {
      toast.error("Digite um código de verificação");
      return;
    }

    try {
      setLoading(true);
      const result = await verifyCertificate(code);

      if (result.isValid && result.certificate) {
        setCertificate(result.certificate);
        toast.success("Certificado verificado com sucesso!");
      } else {
        setCertificate(null);
        toast.error(result.message || "Certificado não encontrado ou inválido");
      }
    } catch (error) {
      setCertificate(null);
      toast.error("Erro ao verificar certificado");
      console.error(error);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  // Copiar código de verificação
  const copyVerificationCode = () => {
    if (certificate) {
      navigator.clipboard.writeText(certificate.verificationCode);
      toast.success("Código de verificação copiado");
    }
  };

  // Copiar número do certificado
  const copyCertificateNumber = () => {
    if (certificate) {
      navigator.clipboard.writeText(certificate.certificateNumber);
      toast.success("Número do certificado copiado");
    }
  };

  // Formatar data
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  // Verificar se certificado está expirado
  const isExpired = () => {
    return certificate?.validUntil && certificate.validUntil < new Date();
  };

  // Verificar se certificado é válido
  const isValid = () => {
    return certificate?.isValid && !isExpired();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <IconAward className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">
                Verificação de Certificados
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Verifique a autenticidade de certificados emitidos pela nossa
              plataforma
            </p>
          </div>

          {/* Formulário de Verificação */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconSearch className="h-5 w-5" />
                Verificar Certificado
              </CardTitle>
              <CardDescription>
                Digite o código de verificação do certificado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Ex: ABC12345"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.toUpperCase())
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      verifyCertificateCode(verificationCode);
                    }
                  }}
                  className="text-center font-mono text-lg"
                  maxLength={8}
                />
                <p className="text-xs text-muted-foreground text-center">
                  Código de 8 caracteres alfanuméricos
                </p>
              </div>
              <Button
                onClick={() => verifyCertificateCode(verificationCode)}
                disabled={loading || !verificationCode.trim()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Verificando..." : "Verificar Certificado"}
              </Button>
            </CardContent>
          </Card>

          {/* Resultado da Verificação */}
          {searched && !loading && (
            <div className="max-w-2xl mx-auto">
              {certificate ? (
                <Card className="border-2 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <IconCheck className="h-6 w-6 text-green-600" />
                      <CardTitle className="text-green-800 dark:text-green-200">
                        Certificado Válido
                      </CardTitle>
                    </div>
                    <CardDescription className="text-green-700 dark:text-green-300">
                      Este certificado foi emitido e é válido em nossa
                      plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {isValid() ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          <IconCheck className="h-3 w-3 mr-1" />
                          Válido
                        </Badge>
                      ) : isExpired() ? (
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        >
                          <IconX className="h-3 w-3 mr-1" />
                          Expirado
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <IconX className="h-3 w-3 mr-1" />
                          Inválido
                        </Badge>
                      )}
                    </div>

                    {/* Informações do Certificado */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {certificate.title}
                        </h3>
                        {certificate.description && (
                          <p className="text-muted-foreground">
                            {certificate.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Número do Certificado
                          </label>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                              {certificate.certificateNumber}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={copyCertificateNumber}
                              title="Copiar número"
                            >
                              <IconCopy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Código de Verificação
                          </label>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                              {certificate.verificationCode}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={copyVerificationCode}
                              title="Copiar código"
                            >
                              <IconCopy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Data de Emissão
                          </label>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(certificate.issuedAt)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Data de Validade
                          </label>
                          <p className="text-sm text-muted-foreground">
                            {certificate.validUntil
                              ? formatDate(certificate.validUntil)
                              : "Indefinida"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Informações do Usuário */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <IconUsers className="h-4 w-4" />
                        Informações do Participante
                      </h4>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {certificate.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{certificate.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {certificate.user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Informações do Curso */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <IconFileText className="h-4 w-4" />
                        Informações do Curso
                      </h4>
                      <div className="flex items-start gap-3">
                        {certificate.course.thumbnail && (
                          <Image
                            src={certificate.course.thumbnail}
                            alt={certificate.course.title}
                            width={60}
                            height={45}
                            className="rounded object-cover"
                          />
                        )}
                        <div className="space-y-1">
                          <p className="font-medium">
                            {certificate.course.title}
                          </p>
                          {certificate.course.category && (
                            <Badge variant="outline" className="text-xs">
                              {certificate.course.category.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    {certificate.certificateUrl && (
                      <div className="border-t pt-4">
                        <Button
                          onClick={() =>
                            certificate.certificateUrl &&
                            window.open(certificate.certificateUrl, "_blank")
                          }
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <IconDownload className="h-4 w-4 mr-2" />
                          Download do Certificado
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <IconX className="h-6 w-6 text-red-600" />
                      <CardTitle className="text-red-800 dark:text-red-200">
                        Certificado Não Encontrado
                      </CardTitle>
                    </div>
                    <CardDescription className="text-red-700 dark:text-red-300">
                      O código de verificação fornecido não corresponde a nenhum
                      certificado válido
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Verifique se o código está correto ou entre em contato
                      conosco para mais informações.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Informações Adicionais */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Como Verificar um Certificado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">
                  1. Localize o Código de Verificação
                </h4>
                <p className="text-sm text-muted-foreground">
                  Cada certificado possui um código único de 8 caracteres
                  alfanuméricos.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">2. Digite o Código</h4>
                <p className="text-sm text-muted-foreground">
                  Insira o código no campo acima e clique em &ldquo;Verificar
                  Certificado&rdquo;.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">3. Confirme a Validade</h4>
                <p className="text-sm text-muted-foreground">
                  O sistema irá confirmar se o certificado é válido e mostrar
                  todas as informações.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
