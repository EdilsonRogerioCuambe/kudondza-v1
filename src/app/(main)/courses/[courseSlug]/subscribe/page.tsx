"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ViewPageLayout } from "@/components/ui/view-page-layout";
import { motion } from "framer-motion";
import {
  Award,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Globe,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SubscribePage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseSlug}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseSlug]);

  if (loading) {
    return (
      <ViewPageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </ViewPageLayout>
    );
  }

  if (!course) {
    return (
      <ViewPageLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-semibold">Curso não encontrado</h1>
          <p className="text-muted-foreground mt-2">
            Verifique o link ou explore outros cursos.
          </p>
          <Link
            href="/courses"
            className="inline-block mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ver cursos
          </Link>
        </div>
      </ViewPageLayout>
    );
  }

  const hasDiscount =
    course.originalPrice && course.originalPrice > course.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((course.originalPrice - course.price) / course.originalPrice) * 100
      )
    : 0;

  return (
    <ViewPageLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold">Assinar {course.title}</h1>
          <p className="text-xl text-muted-foreground">
            Comece sua jornada de aprendizado hoje mesmo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Informações do curso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.thumbnail && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                  {course.shortDescription && (
                    <p className="text-muted-foreground">
                      {course.shortDescription}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {course.level}
                    </span>
                    {course.language && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {course.language}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {course.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {Math.round((course.duration / 60) * 10) / 10}h
                        </span>
                      </div>
                    )}
                    {course._count?.enrollments && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{course._count.enrollments} alunos</span>
                      </div>
                    )}
                    {course._count?.modules && (
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <span>{course._count.modules} módulos</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing & Subscription */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {course.price === 0 ? "Acesso Gratuito" : "Assinatura Mensal"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center">
                  {course.price === 0 ? (
                    <div className="space-y-2">
                      <span className="text-4xl font-bold text-green-600">
                        Gratuito
                      </span>
                      <p className="text-muted-foreground">
                        Acesso completo para sempre
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-5xl font-bold">
                          {course.currency} {Number(course.price).toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xl text-muted-foreground line-through">
                            {course.currency}{" "}
                            {Number(course.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        Por mês • Cancele quando quiser
                      </p>
                      {hasDiscount && (
                        <p className="text-green-600 font-semibold">
                          Economize {discountPercentage}% no primeiro mês!
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Benefits */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">O que você recebe:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Acesso completo a todos os módulos</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Certificado de conclusão</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Atualizações futuras incluídas</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Suporte da comunidade</span>
                    </li>
                    {course.allowDownload && (
                      <li className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Download de materiais</span>
                      </li>
                    )}
                    <li className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Badges e conquistas</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                {/* CTA Button */}
                <Button size="lg" className="w-full text-lg py-6" asChild>
                  <Link href={`/courses/${course.slug}/learn`}>
                    {course.price === 0 ? (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Começar agora
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Assinar curso
                      </>
                    )}
                  </Link>
                </Button>

                {/* Guarantee */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Garantia de 30 dias • Cancele quando quiser</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    <strong>Como funciona:</strong> Após a assinatura, você terá
                    acesso imediato a todo o conteúdo do curso. Estude no seu
                    próprio ritmo e acesse de qualquer dispositivo.
                  </p>
                  <p>
                    <strong>Suporte:</strong> Nossa equipe está sempre
                    disponível para ajudar você em sua jornada de aprendizado.
                  </p>
                  <p>
                    <strong>Atualizações:</strong> Novos conteúdos e melhorias
                    são adicionados regularmente sem custo adicional.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ViewPageLayout>
  );
}
