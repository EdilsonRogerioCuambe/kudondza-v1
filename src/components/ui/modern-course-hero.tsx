"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  Award,
  Bookmark,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Globe,
  Heart,
  PlayCircle,
  Share2,
  Shield,
  Star,
  ThumbsUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import VideoPlayer from "../video-player";

interface ModernCourseHeroProps {
  course: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    thumbnail?: string;
    trailer?: string;
    level: string;
    language?: string;
    duration?: number;
    price: number;
    originalPrice?: number;
    currency: string;
    allowDownload?: boolean;
    tags?: string[];
    _count?: {
      enrollments: number;
      modules: number;
    };
    instructor?: {
      name: string;
      image?: string;
    };
  };
  isEnrolled?: boolean;
  isCompleted?: boolean;
  progress?: number;
  previewLessons?: number;
  totalLessons?: number;
  rating?: number;
  reviewCount?: number;
}

export function ModernCourseHero({
  course,
  isEnrolled,
  isCompleted,
  progress,
  previewLessons,
  totalLessons,
  rating,
  reviewCount,
}: ModernCourseHeroProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const hasDiscount =
    course.originalPrice && course.originalPrice > course.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((course.originalPrice! - course.price) / course.originalPrice!) * 100
      )
    : 0;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: course.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback para copiar link
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "expert":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/10" />

      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Breadcrumb e Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0 flex-1">
                <Link href="/" className="hover:text-primary transition-colors">
                  Início
                </Link>
                <span>/</span>
                <Link
                  href="/courses"
                  className="hover:text-primary transition-colors"
                >
                  Cursos
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium truncate">
                  {course.title}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Action Buttons */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`transition-colors ${
                      isLiked ? "text-red-500 border-red-500" : ""
                    }`}
                  >
                    <ThumbsUp
                      className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`transition-colors ${
                      isBookmarked ? "text-yellow-500 border-yellow-500" : ""
                    }`}
                  >
                    <Bookmark
                      className={`h-4 w-4 ${
                        isBookmarked ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                {isCompleted && (
                  <Badge className="bg-green-500 text-white text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Concluído</span>
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Título e Descrição */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge className={getLevelColor(course.level)}>
                  {course.level}
                </Badge>
                {course.language && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {course.language}
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge className="bg-red-500 text-white">
                    -{discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                {course.title}
              </h1>

              {course.shortDescription && (
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  {course.shortDescription}
                </p>
              )}

              {/* Meta informações */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-muted-foreground">
                {course._count?.enrollments && (
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    {course._count.enrollments} alunos
                  </span>
                )}
                {rating && (
                  <span className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    {rating.toFixed(1)} ({reviewCount} avaliações)
                  </span>
                )}
                {course.duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    {Math.round((course.duration / 60) * 10) / 10}h
                  </span>
                )}
                {course._count?.modules && (
                  <span className="flex items-center gap-1.5">
                    <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {course._count.modules} módulos
                  </span>
                )}
                {previewLessons && totalLessons && (
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    {previewLessons} aulas gratuitas
                  </span>
                )}
              </div>
            </motion.div>

            {/* Trailer ou Thumbnail */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              {course.trailer ? (
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <VideoPlayer src={course.trailer} poster={course.thumbnail} />
                </div>
              ) : course.thumbnail ? (
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button size="lg" className="rounded-full">
                      <PlayCircle className="h-6 w-6 mr-2" />
                      Ver trailer
                    </Button>
                  </div>
                </div>
              ) : null}
            </motion.div>

            {/* Progress bar para cursos em andamento */}
            {isEnrolled && progress !== undefined && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Seu progresso</span>
                  <span className="text-muted-foreground">
                    {progress}% concluído
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Purchase/Enroll Card */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-6"
            >
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {isCompleted ? (
                      <>
                        <Award className="h-6 w-6 text-yellow-500" />
                        Parabéns!
                      </>
                    ) : isEnrolled ? (
                      <>
                        <PlayCircle className="h-6 w-6 text-primary" />
                        Continue aprendendo
                      </>
                    ) : (
                      <>
                        <Heart className="h-6 w-6 text-primary" />
                        Comece agora
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Preço */}
                  <div className="text-center">
                    {course.price === 0 ? (
                      <div className="space-y-2">
                        <span className="text-3xl font-bold text-green-600">
                          Gratuito
                        </span>
                        <p className="text-sm text-muted-foreground">
                          Acesso completo para sempre
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-4xl font-bold">
                            {course.currency} {Number(course.price).toFixed(2)}
                          </span>
                          {hasDiscount && (
                            <span className="text-lg text-muted-foreground line-through">
                              {course.currency}{" "}
                              {Number(course.originalPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Acesso mensal • Cancele quando quiser
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Botão principal */}
                  <Button size="lg" className="w-full text-lg py-6" asChild>
                    <Link
                      href={
                        isEnrolled
                          ? `/courses/${course.slug}/learn`
                          : `/courses/${course.slug}/payment`
                      }
                    >
                      {isCompleted ? (
                        <>
                          <Award className="h-5 w-5 mr-2" />
                          Ver certificado
                        </>
                      ) : isEnrolled ? (
                        <>
                          <PlayCircle className="h-5 w-5 mr-2" />
                          Continuar curso
                        </>
                      ) : (
                        <>
                          <Heart className="h-5 w-5 mr-2" />
                          {course.price === 0
                            ? "Começar agora"
                            : "Assinar curso"}
                        </>
                      )}
                    </Link>
                  </Button>

                  <Separator />

                  {/* Benefícios */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">
                      O que você recebe:
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Acesso mensal completo</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Certificado de conclusão</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Atualizações futuras incluídas</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Suporte da comunidade</span>
                      </li>
                      {course.allowDownload && (
                        <li className="flex items-center gap-3">
                          <Download className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>Download de materiais</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <Separator />

                  {/* Garantia */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Garantia de 30 dias</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
