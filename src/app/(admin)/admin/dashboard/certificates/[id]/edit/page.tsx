"use client";

import { getCertificate, updateCertificate } from "@/actions/certificates";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft, IconAward, IconCalendar } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateCertificateSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  description: z.string().optional(),
  validUntil: z.string().optional(),
});

type UpdateCertificateForm = z.infer<typeof updateCertificateSchema>;

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

export default function EditCertificatePage() {
  const params = useParams();
  const router = useRouter();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const certificateId = params.id as string;

  const form = useForm<UpdateCertificateForm>({
    resolver: zodResolver(updateCertificateSchema),
    defaultValues: {
      title: "",
      description: "",
      validUntil: "",
    },
  });

  // Carregar certificado
  useEffect(() => {
    const loadCertificate = async () => {
      try {
        setLoading(true);
        const data = await getCertificate(certificateId);
        setCertificate(data);

        // Preencher formulário com dados existentes
        form.reset({
          title: data.title,
          description: data.description || "",
          validUntil: data.validUntil
            ? new Date(data.validUntil).toISOString().split("T")[0]
            : "",
        });
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
  }, [certificateId, router, form]);

  // Enviar formulário
  const onSubmit = async (data: UpdateCertificateForm) => {
    try {
      setFormLoading(true);

      await updateCertificate(certificateId, {
        ...data,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
      });

      toast.success("Certificado atualizado com sucesso!");
      router.push(`/admin/dashboard/certificates/${certificateId}`);
    } catch (error) {
      toast.error("Erro ao atualizar certificado");
      console.error(error);
    } finally {
      setFormLoading(false);
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
          <Link href={`/admin/dashboard/certificates/${certificateId}`}>
            <Button variant="ghost" size="sm">
              <IconArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Editar Certificado
          </h1>
          <p className="text-muted-foreground mt-1">
            Atualize as informações do certificado
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconAward className="h-5 w-5" />
                Informações do Certificado
              </CardTitle>
              <CardDescription>
                Atualize as informações do certificado conforme necessário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Título */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Certificado</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Certificado de Conclusão - React Avançado"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Título que aparecerá no certificado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Descrição */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descrição adicional do certificado..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Informações adicionais sobre o certificado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Data de Validade */}
                  <FormField
                    control={form.control}
                    name="validUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Validade (Opcional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Data até quando o certificado será válido. Deixe em
                          branco para validade indefinida.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Botões */}
                  <div className="flex items-center gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={formLoading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {formLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/admin/dashboard/certificates/${certificateId}`
                        )
                      }
                      disabled={formLoading}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Informações */}
        <div className="space-y-6">
          {/* Informações do Certificado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconAward className="h-5 w-5" />
                Informações Atuais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Número do Certificado</h4>
                <p className="text-sm text-muted-foreground font-mono">
                  {certificate.certificateNumber}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Código de Verificação</h4>
                <p className="text-sm text-muted-foreground font-mono">
                  {certificate.verificationCode}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Data de Emissão</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDate(certificate.issuedAt)}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Status</h4>
                <p className="text-sm text-muted-foreground">
                  {certificate.isValid ? "Válido" : "Inválido"}
                </p>
              </div>

              {certificate.validUntil && (
                <div className="space-y-2">
                  <h4 className="font-medium">Validade Atual</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(certificate.validUntil)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações do Usuário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendar className="h-5 w-5" />
                Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Nome</h4>
                <p className="text-sm text-muted-foreground">
                  {certificate.user.name}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Email</h4>
                <p className="text-sm text-muted-foreground">
                  {certificate.user.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Curso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendar className="h-5 w-5" />
                Curso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Título</h4>
                <p className="text-sm text-muted-foreground">
                  {certificate.course.title}
                </p>
              </div>

              {certificate.course.category && (
                <div className="space-y-2">
                  <h4 className="font-medium">Categoria</h4>
                  <p className="text-sm text-muted-foreground">
                    {certificate.course.category.name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
