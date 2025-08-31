"use client";

import { createCertificate } from "@/actions/certificates";
import { getCourses } from "@/actions/courses";
import { getUsers } from "@/actions/users/get-users";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft, IconAward, IconCalendar } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createCertificateSchema = z.object({
  userId: z.string().min(1, "Usuário é obrigatório"),
  courseId: z.string().min(1, "Curso é obrigatório"),
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  description: z.string().optional(),
  validUntil: z.string().optional(),
});

type CreateCertificateForm = z.infer<typeof createCertificateSchema>;

interface User {
  id: string;
  name: string;
  email: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export default function CreateCertificatePage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const form = useForm<CreateCertificateForm>({
    resolver: zodResolver(createCertificateSchema),
    defaultValues: {
      title: "",
      description: "",
      validUntil: "",
    },
  });

  // Carregar usuários e cursos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [usersData, coursesData] = await Promise.all([
          getUsers({ page: 1, limit: 100 }),
          getCourses({ page: 1, limit: 100 }),
        ]);
        setUsers(usersData.users);
        setCourses(coursesData.data?.courses || []);
      } catch (error) {
        toast.error("Erro ao carregar dados");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Enviar formulário
  const onSubmit = async (data: CreateCertificateForm) => {
    try {
      setFormLoading(true);

      // Preparar dados do template
      const templateData = {
        userName: users.find((u) => u.id === data.userId)?.name || "",
        courseName: courses.find((c) => c.id === data.courseId)?.title || "",
        issuedDate: new Date().toISOString(),
        certificateNumber: "", // Será gerado automaticamente
        verificationCode: "", // Será gerado automaticamente
      };

      // Criar certificado
      await createCertificate({
        ...data,
        templateData,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
      });

      toast.success("Certificado criado com sucesso!");
      router.push("/admin/dashboard/certificates");
    } catch (error) {
      toast.error("Erro ao criar certificado");
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Criar Certificado
          </h1>
          <p className="text-muted-foreground mt-1">
            Emita um novo certificado para um usuário
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
                Preencha as informações necessárias para criar o certificado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Usuário */}
                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuário</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={loading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um usuário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center gap-2">
                                  <span>{user.name}</span>
                                  <span className="text-muted-foreground">
                                    ({user.email})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Curso */}
                  <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Curso</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={loading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um curso" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                <div className="flex items-center gap-2">
                                  <span>{course.title}</span>
                                  {course.category && (
                                    <span className="text-muted-foreground">
                                      ({course.category.name})
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                          Data até quando o certificado será válido
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Botões */}
                  <div className="flex items-center gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={formLoading || loading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {formLoading ? "Criando..." : "Criar Certificado"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        router.push("/admin/dashboard/certificates")
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
                Sobre Certificados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Número do Certificado</h4>
                <p className="text-sm text-muted-foreground">
                  Será gerado automaticamente com formato: CERT-XXXXXXXX-XXXX
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Código de Verificação</h4>
                <p className="text-sm text-muted-foreground">
                  Código único de 8 caracteres para verificação online
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Data de Emissão</h4>
                <p className="text-sm text-muted-foreground">
                  Será definida automaticamente como a data atual
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Validade</h4>
                <p className="text-sm text-muted-foreground">
                  Se não especificada, o certificado será válido indefinidamente
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendar className="h-5 w-5" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Usuários disponíveis</span>
                <span className="font-medium">{users.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cursos disponíveis</span>
                <span className="font-medium">{courses.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
