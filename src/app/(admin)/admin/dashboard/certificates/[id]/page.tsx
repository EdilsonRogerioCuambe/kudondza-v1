"use client";

import {
  deleteCertificate,
  getCertificate,
  invalidateCertificate,
  revalidateCertificate,
} from "@/actions/certificates";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconArrowLeft,
  IconAward,
  IconCalendar,
  IconCheck,
  IconCopy,
  IconDots,
  IconDownload,
  IconEdit,
  IconFileText,
  IconTrash,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
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
    description: string | null;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
  };
}

export default function CertificateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const certificateId = params.id as string;

  // Carregar certificado
  useEffect(() => {
    const loadCertificate = async () => {
      try {
        setLoading(true);
        const data = await getCertificate(certificateId);
        setCertificate(data);
      } catch (error) {
        toast.error("Erro ao carregar certificado");
        console.error(error);
        router.push("/admin/dashboard/certificates");
      } finally {
        setLoading(false);
      }
    };

    if (certificateId) {
      loadCertificate();
    }
  }, [certificateId, router]);

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

  // Invalidar certificado
  const handleInvalidate = async () => {
    if (!certificate) return;

    try {
      setActionLoading(true);
      await invalidateCertificate(certificate.id);
      setCertificate((prev) => (prev ? { ...prev, isValid: false } : null));
      toast.success("Certificado invalidado com sucesso");
    } catch {
      toast.error("Erro ao invalidar certificado");
    } finally {
      setActionLoading(false);
    }
  };

  // Revalidar certificado
  const handleRevalidate = async () => {
    if (!certificate) return;

    try {
      setActionLoading(true);
      await revalidateCertificate(certificate.id);
      setCertificate((prev) => (prev ? { ...prev, isValid: true } : null));
      toast.success("Certificado revalidado com sucesso");
    } catch {
      toast.error("Erro ao revalidar certificado");
    } finally {
      setActionLoading(false);
    }
  };

  // Deletar certificado
  const handleDelete = async () => {
    if (!certificate) return;

    try {
      setActionLoading(true);
      await deleteCertificate(certificate.id);
      toast.success("Certificado deletado com sucesso");
      router.push("/admin/dashboard/certificates");
    } catch {
      toast.error("Erro ao deletar certificado");
    } finally {
      setActionLoading(false);
    }
  };

  // Formatar data
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Carregando certificado...</div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <IconAward className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Certificado não encontrado
        </h3>
        <p className="text-muted-foreground mb-4">
          O certificado que você está procurando não existe ou foi removido.
        </p>
        <Button
          onClick={() => router.push("/admin/dashboard/certificates")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Voltar para Certificados
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-4">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-start">
          <Link href="/admin/dashboard/certificates">
            <Button variant="ghost" size="sm">
              <IconArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {certificate.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              Detalhes do certificado emitido
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() =>
                router.push(
                  `/admin/dashboard/certificates/${certificate.id}/edit`
                )
              }
              variant="outline"
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <IconDots className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {certificate.certificateUrl && (
                  <DropdownMenuItem
                    onClick={() =>
                      certificate.certificateUrl &&
                      window.open(certificate.certificateUrl, "_blank")
                    }
                  >
                    <IconDownload className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/verify/${certificate.verificationCode}`)
                  }
                >
                  <IconCheck className="h-4 w-4 mr-2" />
                  Verificar Online
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <IconTrash className="h-4 w-4 mr-2" />
                  Deletar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status do Certificado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconAward className="h-5 w-5" />
                Status do Certificado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <label className="text-sm font-medium">Data de Emissão</label>
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

              {/* Ações de Status */}
              <div className="flex items-center gap-2 pt-4">
                {certificate.isValid ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" disabled={actionLoading}>
                        <IconX className="h-4 w-4 mr-2" />
                        Invalidar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invalidar Certificado</DialogTitle>
                        <DialogDescription>
                          Tem certeza que deseja invalidar este certificado?
                          Esta ação pode ser revertida posteriormente.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const closeButton = document.querySelector(
                              "[data-radix-dialog-close]"
                            ) as HTMLElement;
                            if (closeButton) closeButton.click();
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleInvalidate}
                        >
                          Invalidar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button
                    onClick={handleRevalidate}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <IconCheck className="h-4 w-4 mr-2" />
                    Revalidar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações do Usuário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUsers className="h-5 w-5" />
                Informações do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {certificate.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">
                    {certificate.user.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {certificate.user.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Curso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconFileText className="h-5 w-5" />
                Informações do Curso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                {certificate.course.thumbnail && (
                  <Image
                    src={certificate.course.thumbnail}
                    alt={certificate.course.title}
                    width={80}
                    height={60}
                    className="rounded object-cover"
                  />
                )}
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-semibold">
                    {certificate.course.title}
                  </h3>
                  {certificate.course.category && (
                    <Badge variant="outline">
                      {certificate.course.category.name}
                    </Badge>
                  )}
                  {certificate.course.description && (
                    <p className="text-sm text-muted-foreground">
                      {certificate.course.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descrição */}
          {certificate.description && (
            <Card>
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {certificate.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Links Rápidos */}
          <Card>
            <CardHeader>
              <CardTitle>Links Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  router.push(`/verify/${certificate.verificationCode}`)
                }
              >
                <IconCheck className="h-4 w-4 mr-2" />
                Verificar Online
              </Button>
              {certificate.certificateUrl && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    certificate.certificateUrl &&
                    window.open(certificate.certificateUrl, "_blank")
                  }
                >
                  <IconDownload className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  router.push(
                    `/admin/dashboard/certificates/${certificate.id}/edit`
                  )
                }
              >
                <IconEdit className="h-4 w-4 mr-2" />
                Editar Certificado
              </Button>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendar className="h-5 w-5" />
                Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Criado em</span>
                <span className="text-sm font-medium">
                  {formatDate(certificate.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <span className="text-sm font-medium">
                  {certificate.isValid ? "Ativo" : "Inativo"}
                </span>
              </div>
              {certificate.validUntil && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Expira em</span>
                  <span className="text-sm font-medium">
                    {formatDate(certificate.validUntil)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
