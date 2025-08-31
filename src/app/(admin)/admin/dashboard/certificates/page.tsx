"use client";

import {
  deleteCertificate,
  deleteMultipleCertificates,
  getCertificates,
} from "@/actions/certificates";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconAward,
  IconCalendar,
  IconCheck,
  IconCopy,
  IconDots,
  IconDownload,
  IconEdit,
  IconEye,
  IconFileText,
  IconFilter,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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

interface CertificateStats {
  total: number;
  valid: number;
  expired: number;
  invalid: number;
  recentIssued: number;
}

export default function CertificatesPage() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<CertificateStats>({
    total: 0,
    valid: 0,
    expired: 0,
    invalid: 0,
    recentIssued: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>(
    []
  );
  const [filters, setFilters] = useState({
    search: "",
    isValid: undefined as boolean | undefined,
    sortBy: "issuedAt" as "issuedAt" | "createdAt" | "title",
    sortOrder: "desc" as "asc" | "desc",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Carregar certificados
  const loadCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getCertificates({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });

      setCertificates(result.certificates);
      setPagination(result.pagination);

      // Calcular estatísticas
      const total = result.pagination.total;
      const valid = result.certificates.filter(
        (c) => c.isValid && (!c.validUntil || c.validUntil > new Date())
      ).length;
      const expired = result.certificates.filter(
        (c) => c.validUntil && c.validUntil < new Date()
      ).length;
      const invalid = result.certificates.filter((c) => !c.isValid).length;
      const recentIssued = result.certificates.filter((c) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return c.issuedAt > thirtyDaysAgo;
      }).length;

      setStats({ total, valid, expired, invalid, recentIssued });
    } catch {
      toast.error("Erro ao carregar certificados");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Carregar dados iniciais
  useEffect(() => {
    loadCertificates();
  }, [filters, pagination.page, loadCertificates]);

  // Aplicar filtros
  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      search: "",
      isValid: undefined,
      sortBy: "issuedAt",
      sortOrder: "desc",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Selecionar/deselecionar certificado
  const toggleCertificateSelection = (id: string) => {
    setSelectedCertificates((prev) =>
      prev.includes(id) ? prev.filter((certId) => certId !== id) : [...prev, id]
    );
  };

  // Selecionar todos
  const selectAll = () => {
    setSelectedCertificates(certificates.map((c) => c.id));
  };

  // Deselecionar todos
  const deselectAll = () => {
    setSelectedCertificates([]);
  };

  // Deletar certificado
  const handleDeleteCertificate = async (id: string) => {
    try {
      await deleteCertificate(id);
      toast.success("Certificado deletado com sucesso");
      loadCertificates();
    } catch {
      toast.error("Erro ao deletar certificado");
    }
  };

  // Deletar múltiplos certificados
  const handleDeleteMultiple = async () => {
    if (selectedCertificates.length === 0) return;

    try {
      await deleteMultipleCertificates(selectedCertificates);
      toast.success(
        `${selectedCertificates.length} certificados deletados com sucesso`
      );
      setSelectedCertificates([]);
      loadCertificates();
    } catch {
      toast.error("Erro ao deletar certificados");
    }
  };

  // Copiar código de verificação
  const copyVerificationCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Código de verificação copiado");
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
  const isExpired = (certificate: Certificate) => {
    return certificate.validUntil && certificate.validUntil < new Date();
  };

  // Verificar se certificado é válido
  const isValid = (certificate: Certificate) => {
    return certificate.isValid && !isExpired(certificate);
  };

  return (
    <div className="space-y-6 px-6 py-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificados</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e visualize todos os certificados emitidos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/admin/dashboard/certificates/create")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Criar Certificado
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <IconAward className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Certificados emitidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Válidos</CardTitle>
            <IconCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.valid}
            </div>
            <p className="text-xs text-muted-foreground">Ativos e válidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirados</CardTitle>
            <IconX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.expired}
            </div>
            <p className="text-xs text-muted-foreground">Prazo vencido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inválidos</CardTitle>
            <IconX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.invalid}
            </div>
            <p className="text-xs text-muted-foreground">Revogados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recentes</CardTitle>
            <IconCalendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.recentIssued}
            </div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <Input
                placeholder="Buscar por título, descrição..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.isValid?.toString() || "all"}
                onValueChange={(value) => {
                  const boolValue =
                    value === "all" ? undefined : value === "true";
                  setFilters((prev) => ({ ...prev, isValid: boolValue }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="true">Válidos</SelectItem>
                  <SelectItem value="false">Inválidos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ordenar por</label>
              <Select
                value={filters.sortBy}
                onValueChange={(value: "issuedAt" | "createdAt" | "title") =>
                  setFilters((prev) => ({ ...prev, sortBy: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="issuedAt">Data de emissão</SelectItem>
                  <SelectItem value="createdAt">Data de criação</SelectItem>
                  <SelectItem value="title">Título</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ordem</label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value: "asc" | "desc") =>
                  setFilters((prev) => ({ ...prev, sortOrder: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Decrescente</SelectItem>
                  <SelectItem value="asc">Crescente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button onClick={applyFilters} size="sm">
              <IconSearch className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
            <Button onClick={clearFilters} variant="outline" size="sm">
              <IconX className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ações em lote */}
      {selectedCertificates.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {selectedCertificates.length} certificado(s) selecionado(s)
                </span>
                <Button
                  onClick={deselectAll}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Deselecionar todos
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleDeleteMultiple}
                  variant="destructive"
                  size="sm"
                >
                  <IconTrash className="h-4 w-4 mr-2" />
                  Deletar Selecionados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Certificados */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Certificados</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={selectAll}
                variant="outline"
                size="sm"
                disabled={certificates.length === 0}
              >
                Selecionar Todos
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">
                Carregando certificados...
              </div>
            </div>
          ) : certificates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <IconAward className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum certificado encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                {filters.search || filters.isValid !== undefined
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando o primeiro certificado"}
              </p>
              {!filters.search && filters.isValid === undefined && (
                <Button
                  onClick={() =>
                    router.push("/admin/dashboard/certificates/create")
                  }
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <IconPlus className="h-4 w-4 mr-2" />
                  Criar Certificado
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {certificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    id={`certificate-${certificate.id}`}
                    checked={selectedCertificates.includes(certificate.id)}
                    onChange={() => toggleCertificateSelection(certificate.id)}
                    className="h-4 w-4"
                    aria-label={`Selecionar certificado ${certificate.title}`}
                  />

                  {/* Avatar do usuário */}
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {certificate.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Informações do certificado */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">
                        {certificate.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        {isValid(certificate) ? (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          >
                            <IconCheck className="h-3 w-3 mr-1" />
                            Válido
                          </Badge>
                        ) : isExpired(certificate) ? (
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
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <IconUsers className="h-3 w-3" />
                        {certificate.user.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconFileText className="h-3 w-3" />
                        {certificate.course.title}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconCalendar className="h-3 w-3" />
                        Emitido em {formatDate(certificate.issuedAt)}
                      </span>
                      <span className="font-mono text-xs">
                        #{certificate.certificateNumber}
                      </span>
                    </div>

                    {certificate.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {certificate.description}
                      </p>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyVerificationCode(certificate.verificationCode)
                      }
                      title="Copiar código de verificação"
                    >
                      <IconCopy className="h-4 w-4" />
                    </Button>

                    {certificate.certificateUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          certificate.certificateUrl &&
                          window.open(certificate.certificateUrl, "_blank")
                        }
                        title="Download do certificado"
                      >
                        <IconDownload className="h-4 w-4" />
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <IconDots className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/admin/dashboard/certificates/${certificate.id}`
                            )
                          }
                        >
                          <IconEye className="h-4 w-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/admin/dashboard/certificates/${certificate.id}/edit`
                            )
                          }
                        >
                          <IconEdit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteCertificate(certificate.id)
                          }
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <IconTrash className="h-4 w-4 mr-2" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                de {pagination.total} certificados
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={!pagination.hasPrevPage}
                >
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={!pagination.hasNextPage}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
