"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Eye, PlayCircle, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ModernCourseCardProps {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  level: string;
  language?: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  duration?: number;
  enrollmentsCount?: number;
  rating?: number;
  isEnrolled?: boolean;
  isCompleted?: boolean;
  progress?: number;
  previewLessons?: number;
  totalLessons?: number;
  className?: string;
  // Novos props para progresso
  enrollmentProgress?: number;
  enrollmentStatus?: string;
  completedAt?: Date | null;
}

export function ModernCourseCard({
  id: _id,
  title,
  slug,
  thumbnail,
  level,
  language,
  shortDescription,
  price,
  originalPrice,
  currency,
  duration,
  enrollmentsCount,
  rating,
  isEnrolled,
  isCompleted,
  progress,
  previewLessons,
  totalLessons,
  className,
  // Novos props para progresso
  enrollmentProgress,
  enrollmentStatus: _enrollmentStatus,
  completedAt,
}: ModernCourseCardProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/20">
        {/* Thumbnail */}
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <PlayCircle className="h-16 w-16 text-primary/50" />
              </div>
            )}
          </AspectRatio>

          {/* Overlay com badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {hasDiscount && (
              <Badge className="bg-red-500 text-white shadow-lg">
                -{discountPercentage}%
              </Badge>
            )}
            <Badge className={getLevelColor(level)}>{level}</Badge>
          </div>

          {/* Status overlay */}
          <div className="absolute top-3 right-3">
            {isCompleted ? (
              <Badge className="bg-green-500 text-white shadow-lg">
                <CheckCircle className="h-3 w-3 mr-1" />
                Concluído
              </Badge>
            ) : isEnrolled ? (
              <Badge className="bg-blue-500 text-white shadow-lg">
                <PlayCircle className="h-3 w-3 mr-1" />
                Em andamento
              </Badge>
            ) : (
              <Badge variant="secondary" className="shadow-lg">
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Badge>
            )}
          </div>

          {/* Progress bar para cursos em andamento */}
          {isEnrolled && progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            {shortDescription && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {shortDescription}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Meta informações */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.round((duration / 60) * 10) / 10}h
              </span>
            )}
            {enrollmentsCount && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {enrollmentsCount}
              </span>
            )}
            {rating && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {rating.toFixed(1)}
              </span>
            )}
            {previewLessons && totalLessons && (
              <span className="flex items-center gap-1">
                <PlayCircle className="h-3 w-3" />
                {previewLessons}/{totalLessons} aulas
              </span>
            )}
          </div>

          {/* Barra de progresso para cursos matriculados */}
          {isEnrolled && typeof enrollmentProgress === "number" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">
                  {Math.round(enrollmentProgress)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${enrollmentProgress}%` }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Preço ou status do curso */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              {isEnrolled ? (
                <span className="text-lg font-bold text-green-600">
                  {completedAt ? "Concluído" : "Matriculado"}
                </span>
              ) : price === 0 ? (
                <span className="text-lg font-bold text-green-600">
                  Gratuito
                </span>
              ) : (
                <>
                  <span className="text-xl font-bold">
                    {currency} {Number(price).toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-muted-foreground line-through">
                      {currency} {Number(originalPrice).toFixed(2)}
                    </span>
                  )}
                </>
              )}
            </div>

            {language && (
              <Badge variant="outline" className="text-xs">
                {language}
              </Badge>
            )}
          </div>

          {/* Botão de ação */}
          <Button
            className="w-full"
            variant={isEnrolled ? "default" : "default"}
            asChild
          >
            <Link
              href={isEnrolled ? `/courses/${slug}/learn` : `/courses/${slug}`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Ver certificado
                </>
              ) : isEnrolled ? (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {completedAt ? "Revisar curso" : "Continuar aprendendo"}
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver curso
                </>
              )}
            </Link>
          </Button>

          {/* Preview info */}
          {!isEnrolled && previewLessons && previewLessons > 0 && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                {previewLessons} aulas gratuitas disponíveis
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
