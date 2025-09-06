"use client";

import type { LessonViewerProps } from "@/@types/course-types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoSection } from "@/components/ui/video-section";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  Eye,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function LessonViewer({
  lesson,
  course: _course,
  module,
}: LessonViewerProps) {
  const [isCompleted, _setIsCompleted] = useState(false);
  const [_isWatching, _setIsWatching] = useState(false);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8">
      {/* Header da Lição */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {module.title}
            </Badge>
            {lesson.isRequired && (
              <Badge variant="destructive" className="text-xs">
                Obrigatória
              </Badge>
            )}
            {lesson.isPreview && (
              <Badge variant="outline" className="text-xs">
                Preview
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight break-words">
              {lesson.title}
            </h1>
            {lesson.shortDescription && (
              <p className="text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed max-w-4xl break-words">
                {lesson.shortDescription}
              </p>
            )}
          </div>
        </div>

        {/* Meta informações da lição */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {lesson.videoDuration && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(lesson.videoDuration)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            <span>Visualização</span>
          </div>
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{lesson.resources.length} recursos</span>
            </div>
          )}
          {isCompleted && (
            <div className="flex items-center gap-1.5 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Concluída</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Player de Vídeo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative"
      >
        {lesson.videoUrl ? (
          <VideoSection videoUrl={lesson.videoUrl} className="w-full h-full" />
        ) : (
          <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center rounded-lg">
            <div className="text-center space-y-4 p-8">
              <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Vídeo não disponível
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Esta lição não possui vídeo associado
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Descrição da Lição */}
      {lesson.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="h-5 w-5" />
                Sobre esta lição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-headings:font-semibold prose-p:break-words prose-li:break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {lesson.description}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Transcript */}
      {lesson.transcript && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Download className="h-5 w-5" />
                Transcrição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-headings:font-semibold prose-p:break-words prose-li:break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {lesson.transcript}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
