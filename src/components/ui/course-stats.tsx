"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Award,
  CheckCircle,
  Clock,
  Eye,
  PlayCircle,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

interface CourseStatsProps {
  totalLessons: number;
  previewLessons: number;
  completedLessons?: number;
  duration?: number;
  enrollmentsCount?: number;
  rating?: number;
  reviewCount?: number;
  level: string;
  isEnrolled?: boolean;
  progress?: number;
}

export function CourseStats({
  totalLessons,
  previewLessons,
  completedLessons = 0,
  duration,
  enrollmentsCount,
  rating,
  reviewCount,
  level,
  isEnrolled,
  progress,
}: CourseStatsProps) {
  const stats = [
    {
      icon: PlayCircle,
      label: "Aulas totais",
      value: totalLessons,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: Eye,
      label: "Aulas gratuitas",
      value: previewLessons,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    ...(isEnrolled
      ? [
          {
            icon: CheckCircle,
            label: "Concluídas",
            value: completedLessons,
            color: "text-emerald-500",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
          },
        ]
      : []),
    ...(duration
      ? [
          {
            icon: Clock,
            label: "Duração",
            value: `${Math.round((duration / 60) * 10) / 10}h`,
            color: "text-purple-500",
            bgColor: "bg-purple-50 dark:bg-purple-950/20",
          },
        ]
      : []),
    ...(enrollmentsCount
      ? [
          {
            icon: Users,
            label: "Alunos",
            value: enrollmentsCount.toLocaleString(),
            color: "text-orange-500",
            bgColor: "bg-orange-50 dark:bg-orange-950/20",
          },
        ]
      : []),
    ...(rating
      ? [
          {
            icon: Star,
            label: "Avaliação",
            value: rating.toFixed(1),
            color: "text-yellow-500",
            bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
            subtitle: `(${reviewCount} avaliações)`,
          },
        ]
      : []),
  ];

  const getLevelInfo = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return {
          label: "Iniciante",
          color: "text-green-600",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          icon: TrendingUp,
        };
      case "intermediate":
        return {
          label: "Intermediário",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          icon: Zap,
        };
      case "advanced":
        return {
          label: "Avançado",
          color: "text-orange-600",
          bgColor: "bg-orange-100 dark:bg-orange-900/30",
          icon: Award,
        };
      case "expert":
        return {
          label: "Especialista",
          color: "text-red-600",
          bgColor: "bg-red-100 dark:bg-red-900/30",
          icon: Award,
        };
      default:
        return {
          label: level,
          color: "text-gray-600",
          bgColor: "bg-gray-100 dark:bg-gray-900/30",
          icon: Award,
        };
    }
  };

  const levelInfo = getLevelInfo(level);

  return (
    <div className="space-y-6">
      {/* Progress Bar (se inscrito) */}
      {isEnrolled && progress !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Seu progresso</span>
            <span className="text-muted-foreground">{progress}% concluído</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* Level Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-center"
      >
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${levelInfo.bgColor} ${levelInfo.color}`}
        >
          <levelInfo.icon className="h-4 w-4" />
          <span className="font-semibold text-sm">{levelInfo.label}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              className={`${stat.bgColor} border-0 hover:shadow-md transition-shadow h-full`}
            >
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className={`p-1.5 sm:p-2 rounded-full ${stat.bgColor}`}>
                    <stat.icon
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`}
                    />
                  </div>
                </div>
                <div
                  className={`text-lg sm:text-xl lg:text-2xl font-bold ${stat.color} mb-1`}
                >
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                  {stat.label}
                </div>
                {stat.subtitle && (
                  <div className="text-xs text-muted-foreground mt-1 hidden sm:block">
                    {stat.subtitle}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            Certificado incluído
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Acesso vitalício
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Suporte da comunidade
          </span>
        </div>
      </motion.div>
    </div>
  );
}
