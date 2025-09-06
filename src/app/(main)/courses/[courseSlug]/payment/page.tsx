"use client";

import { getSubscription } from "@/actions/subscriptions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewPageLayout } from "@/components/ui/view-page-layout";
import { redirectToCheckout } from "@/lib/stripe-client";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  Globe,
  Shield,
  User,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  thumbnail?: string;
  level: string;
  language?: string;
  duration?: number;
  price: number | string;
  currency: string;
}

interface Subscription {
  id: string;
  status: string;
  [key: string]: unknown; // Allow additional properties
}

export default function PaymentPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseResponse, subscriptionResult] = await Promise.all([
          fetch(`/api/courses/${courseSlug}`),
          getSubscription(),
        ]);

        if (courseResponse.ok) {
          const courseData = await courseResponse.json();
          setCourse(courseData);
        }

        if (subscriptionResult.success && subscriptionResult.data) {
          setSubscription(subscriptionResult.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Erro ao carregar dados do curso");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseSlug]);

  const handlePayment = async () => {
    if (!course) return;

    try {
      setProcessing(true);

      // Get or create Stripe price for this specific course
      const response = await fetch(`/api/courses/${course.id}/stripe-price`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isRecurring: true, // Cobrança recorrente mensal
          interval: "month",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Erro ao configurar preço do curso");
        return;
      }

      const { priceId } = await response.json();

      await redirectToCheckout({
        priceId: priceId,
        trialPeriodDays: 7,
        courseSlug: courseSlug,
      });
    } catch (error) {
      console.error("Erro ao iniciar checkout:", error);
      toast.error("Erro ao iniciar processo de pagamento");
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (amount: number | string, currency: string) => {
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numericAmount)) {
      return `${currency} 0.00`;
    }
    return `${currency} ${numericAmount.toFixed(2)}`;
  };

  const isSubscribed =
    subscription && ["ACTIVE", "TRIALING"].includes(subscription.status);

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
          <h1 className="text-4xl font-bold">Finalizar Pagamento</h1>
          <p className="text-xl text-muted-foreground">
            Tenha acesso completo ao curso
          </p>
        </motion.div>

        {/* Course Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {course.thumbnail && (
                  <div className="relative w-full md:w-48 h-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-semibold">{course.title}</h3>
                  {course.shortDescription && (
                    <p className="text-muted-foreground text-lg">
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
                    {course.duration && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.round((course.duration / 60) * 10) / 10}h
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription Status */}
        {isSubscribed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">
                      Você já tem uma assinatura ativa!
                    </h3>
                    <p className="text-green-600">
                      Aproveite o acesso completo a todos os cursos premium.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Link
                      href={`/courses/${course.slug}/learn`}
                      className="flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      Começar Curso Agora
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg">
                    <Link href="/courses" className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Explorar Outros Cursos
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg">
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Gerenciar Assinatura
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Payment Section */}
        {!isSubscribed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Assinatura do Curso</h2>
              <p className="text-muted-foreground text-lg">
                Acesso recorrente mensal a este curso e todos os outros
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <Card className="border-blue-500 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Acesso Mensal</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {formatPrice(course.price, course.currency)}
                    </span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Acesso completo a todos os cursos premium
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">
                        Acesso a todos os cursos premium
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">Certificados de conclusão</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">
                        Atualizações futuras incluídas
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">Suporte da comunidade</span>
                    </li>
                  </ul>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePayment}
                    disabled={processing}
                  >
                    {processing ? "Processando..." : "Assinar Agora"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  O que você recebe:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Acesso Completo</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Acesso a todos os cursos premium</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Certificados de conclusão</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Atualizações futuras incluídas</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Suporte da comunidade</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Recursos Extras</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Download de materiais</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Badges e conquistas</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Garantia de 30 dias</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Suporte prioritário</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trial Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold text-blue-800">
                    🎉 Teste grátis por 7 dias!
                  </h3>
                  <p className="text-blue-600">
                    Comece sua jornada de aprendizado sem compromisso. Cancele a
                    qualquer momento durante o período de teste.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                    <Shield className="h-4 w-4" />
                    <span>Sem cartão de crédito necessário para começar</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </ViewPageLayout>
  );
}
