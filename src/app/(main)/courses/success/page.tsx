"use client";

import successAnimation from "@/animations/success-checkmark.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewPageLayout } from "@/components/ui/view-page-layout";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { ArrowRight, BookOpen, Home, Play, Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Confetti from "react-confetti";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const courseSlug = searchParams.get("course_slug");
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);
  const [course, setCourse] = useState<{
    id: string;
    title: string;
    slug: string;
    shortDescription?: string;
    thumbnail?: string;
  } | null>(null);

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    // Stop confetti after 8 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 8000);

    // Fetch course data if courseSlug is provided
    if (courseSlug) {
      fetch(`/api/courses/${courseSlug}`)
        .then((res) => res.json())
        .then((data) => setCourse(data))
        .catch((error) => console.error("Error fetching course:", error));
    }

    return () => {
      window.removeEventListener("resize", updateWindowSize);
      clearTimeout(timer);
    };
  }, [courseSlug]);

  return (
    <ViewPageLayout>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.2}
          initialVelocityY={20}
          initialVelocityX={5}
          colors={["#10b981", "#059669", "#047857", "#065f46", "#064e3b"]}
          wind={0.02}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="flex justify-center"
          >
            <div className="w-40 h-40 relative">
              <Lottie
                animationData={successAnimation}
                loop={false}
                autoplay={true}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </motion.div>

          {/* Success Message */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-green-600 dark:text-green-400">
                Parabéns! 🎉
              </h1>
              <h2 className="text-3xl font-semibold">
                Assinatura Realizada com Sucesso!
              </h2>
            </div>

            {course ? (
              <div className="space-y-4">
                <p className="text-xl text-muted-foreground">
                  Você agora tem acesso completo ao curso:
                </p>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6 max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-primary">
                    {course.title}
                  </h3>
                  {course.shortDescription && (
                    <p className="text-muted-foreground mt-2">
                      {course.shortDescription}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xl text-muted-foreground">
                Você agora tem acesso completo ao curso escolhido.
              </p>
            )}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-200">
                O que você ganhou com esta assinatura:
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Aproveite todos os benefícios incluídos
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">
                      Acesso Completo
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Acesso total ao curso e todos os seus conteúdos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Play className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">
                      Todas as Aulas
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Acesso a todos os módulos e lições do curso
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">
                      Materiais Extras
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Recursos, exercícios e materiais complementares
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">
                      Certificado
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Certificado de conclusão ao final do curso
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">
              Pronto para começar sua jornada de aprendizado?
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            {course ? (
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex-1 sm:flex-none"
              >
                <Link
                  href={`/courses/${course.slug}/learn`}
                  className="flex items-center justify-center gap-3 px-8 py-4"
                >
                  <Play className="w-5 h-5" />
                  Começar Curso Agora
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex-1 sm:flex-none"
              >
                <Link
                  href="/courses"
                  className="flex items-center justify-center gap-3 px-8 py-4"
                >
                  <BookOpen className="w-5 h-5" />
                  Ver Meus Cursos
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-none border-2 hover:bg-blue-50 dark:hover:bg-blue-950/20"
            >
              <Link
                href="/courses"
                className="flex items-center justify-center gap-3 px-8 py-4"
              >
                <BookOpen className="w-5 h-5" />
                Explorar Outros Cursos
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Voltar ao Início
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center space-y-6"
        >
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                  📧 Confirmação por Email
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Você receberá um email de confirmação com todos os detalhes da
                  sua assinatura e instruções para acessar o curso.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Session Info (for debugging) */}
          {sessionId && (
            <div className="text-center text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-2 rounded max-w-md mx-auto">
              <p>Session ID: {sessionId}</p>
            </div>
          )}
        </motion.div>
      </div>
    </ViewPageLayout>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <ViewPageLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </ViewPageLayout>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
