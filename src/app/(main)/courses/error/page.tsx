"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewPageLayout } from "@/components/ui/view-page-layout";
import { motion } from "framer-motion";
import { Home, RefreshCw, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ErrorPageContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Stop animation after 3 seconds
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ViewPageLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Error Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="text-center"
        >
          <div className="relative inline-block">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-12 h-12 text-red-600" />
            </motion.div>

            {/* Shake animation */}
            {showAnimation && (
              <motion.div
                className="absolute inset-0 bg-red-200 rounded-full"
                animate={{
                  x: [-2, 2, -2, 2, 0],
                  scale: [1, 1.05, 1, 1.05, 1],
                }}
                transition={{ duration: 0.5, repeat: 2 }}
              />
            )}
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-red-600">Ops! 😔</h1>
          <h2 className="text-2xl font-semibold">
            Algo deu errado com seu pagamento
          </h2>
          <p className="text-lg text-muted-foreground">
            Não foi possível processar sua assinatura. Não se preocupe, você não
            foi cobrado.
          </p>
        </motion.div>

        {/* Error Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-red-800">
                Possíveis causas:
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Problemas com o cartão de crédito
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Conexão instável com a internet
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Cancelamento do processo pelo usuário
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Problemas temporários do sistema
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
            <Link href="/courses" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Voltar ao Início
            </Link>
          </Button>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center space-y-4"
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-800 mb-2">
                Precisa de ajuda?
              </h3>
              <p className="text-sm text-blue-600 mb-4">
                Se o problema persistir, entre em contato conosco.
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Link href="/support">Suporte Técnico</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error Details (for debugging) */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center text-sm text-muted-foreground"
          >
            <p>Erro: {error}</p>
          </motion.div>
        )}
      </div>
    </ViewPageLayout>
  );
}

export default function ErrorPage() {
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
      <ErrorPageContent />
    </Suspense>
  );
}
