"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  Clock,
  Lock,
  Star,
  Trophy,
  Unlock,
} from "lucide-react";

interface LessonInfo {
  title: string;
  description: string | null;
  shortDescription: string | null;
  order: number;
  isPreview: boolean;
  isRequired: boolean;
  isPublic: boolean;
  xpReward: number;
  videoDuration: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CyberpunkLessonInfoProps {
  lesson: LessonInfo;
  className?: string;
}

export default function CyberpunkLessonInfo({
  lesson,
  className,
}: CyberpunkLessonInfoProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Section */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M0 60L60 0H30L0 30M60 60V30L30 60%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

        <div className="relative z-10">
          {/* Lesson Number Badge */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center border-2 border-primary/50 shadow-lg shadow-primary/20">
                <span className="text-white font-bold font-mono text-lg">
                  {String(lesson.order).padStart(2, "0")}
                </span>
              </div>
              <div className="absolute -inset-1 bg-primary rounded-full opacity-20 animate-pulse" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary font-mono mb-2">
                {lesson.title}
              </h1>
              <div className="flex items-center space-x-4">
                <Badge
                  variant="outline"
                  className={cn(
                    "font-mono",
                    lesson.isPreview
                      ? "bg-primary/20 text-primary border-primary/30"
                      : "bg-secondary/20 text-secondary-foreground border-border"
                  )}
                >
                  {lesson.isPreview ? "Preview" : "Aula Completa"}
                </Badge>

                <Badge
                  variant="outline"
                  className={cn(
                    "font-mono",
                    lesson.isRequired
                      ? "bg-destructive/20 text-destructive border-destructive/30"
                      : "bg-secondary/20 text-secondary-foreground border-border"
                  )}
                >
                  {lesson.isRequired ? "Obrigatória" : "Opcional"}
                </Badge>

                <Badge
                  variant="outline"
                  className={cn(
                    "font-mono",
                    lesson.isPublic
                      ? "bg-primary/20 text-primary border-primary/30"
                      : "bg-secondary/20 text-secondary-foreground border-border"
                  )}
                >
                  {lesson.isPublic ? "Pública" : "Privada"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          {lesson.description && (
            <div className="mb-6">
              <p className="text-foreground font-mono leading-relaxed text-lg">
                {lesson.description}
              </p>
            </div>
          )}

          {lesson.shortDescription && (
            <div className="mb-6">
              <p className="text-muted-foreground font-mono leading-relaxed">
                {lesson.shortDescription}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* XP Reward */}
        <Card className="bg-card border border-border backdrop-blur-sm group hover:border-primary/50 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-primary font-mono text-sm">
                XP Reward
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary font-mono">
              {lesson.xpReward}
            </div>
            <p className="text-muted-foreground text-xs font-mono">
              Pontos de experiência
            </p>
          </CardContent>
        </Card>

        {/* Duration */}
        <Card className="bg-card border border-border backdrop-blur-sm group hover:border-primary/50 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-primary font-mono text-sm">
                Duração
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary font-mono">
              {formatDuration(lesson.videoDuration ?? 0)}
            </div>
            <p className="text-muted-foreground text-xs font-mono">
              Tempo estimado
            </p>
          </CardContent>
        </Card>

        {/* Created Date */}
        <Card className="bg-card border border-border backdrop-blur-sm group hover:border-primary/50 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-primary font-mono text-sm">
                Criada em
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-primary font-mono">
              {formatDate(lesson.createdAt)}
            </div>
            <p className="text-muted-foreground text-xs font-mono">
              Data de criação
            </p>
          </CardContent>
        </Card>

        {/* Updated Date */}
        <Card className="bg-card border border-border backdrop-blur-sm group hover:border-primary/50 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-primary font-mono text-sm">
                Atualizada
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-primary font-mono">
              {formatDate(lesson.updatedAt)}
            </div>
            <p className="text-muted-foreground text-xs font-mono">
              Última atualização
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Access Status */}
      <Card className="bg-card border border-border backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-8 bg-primary rounded-full" />
            <CardTitle className="text-primary font-mono">
              Status de Acesso
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {lesson.isPublic ? (
                <Unlock className="w-5 h-5 text-primary" />
              ) : (
                <Lock className="w-5 h-5 text-destructive" />
              )}
              <span className="text-foreground font-mono">
                {lesson.isPublic ? "Acesso público" : "Acesso restrito"}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {lesson.isPreview ? (
                <Star className="w-5 h-5 text-primary" />
              ) : (
                <BookOpen className="w-5 h-5 text-primary" />
              )}
              <span className="text-foreground font-mono">
                {lesson.isPreview ? "Aula de demonstração" : "Aula completa"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
