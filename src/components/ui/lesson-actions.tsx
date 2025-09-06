"use client";

import type { LessonActionsProps } from "@/@types/course-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Bookmark,
  CheckCircle,
  Download,
  Flag,
  MessageCircle,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";

export function LessonActions({ lesson, module }: LessonActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implementar like da lição
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implementar bookmark da lição
  };

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
    // TODO: Implementar marcação como concluída
  };

  const handleFlag = () => {
    setIsFlagged(!isFlagged);
    // TODO: Implementar flag da lição
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: lesson.title,
          text: `Confira esta lição: ${lesson.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Erro ao compartilhar:", error);
      }
    } else {
      // Fallback para copiar URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = () => {
    // TODO: Implementar download de recursos
    console.log("Download de recursos");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Ações principais */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            Ações da Lição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {/* Marcar como concluída */}
            <Button
              variant={isCompleted ? "default" : "outline"}
              size="sm"
              onClick={handleComplete}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {isCompleted ? "Concluída" : "Marcar como concluída"}
            </Button>

            {/* Like */}
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              {isLiked ? "Curtido" : "Curtir"}
            </Button>

            {/* Bookmark */}
            <Button
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={handleBookmark}
              className="flex items-center gap-2"
            >
              <Bookmark className="h-4 w-4" />
              {isBookmarked ? "Salvo" : "Salvar"}
            </Button>

            {/* Compartilhar */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>

            {/* Download */}
            {lesson.resources && lesson.resources.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar recursos
              </Button>
            )}

            {/* Flag */}
            <Button
              variant={isFlagged ? "destructive" : "outline"}
              size="sm"
              onClick={handleFlag}
              className="flex items-center gap-2"
            >
              <Flag className="h-4 w-4" />
              {isFlagged ? "Sinalizada" : "Sinalizar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações da lição */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Informações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Módulo:</span>
              <span className="ml-2 font-medium">{module.title}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Tipo:</span>
              <span className="ml-2 font-medium">
                {lesson.isRequired ? "Obrigatória" : "Opcional"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Duração:</span>
              <span className="ml-2 font-medium">
                {lesson.videoDuration
                  ? `${Math.floor(lesson.videoDuration / 60)}:${(
                      lesson.videoDuration % 60
                    )
                      .toString()
                      .padStart(2, "0")}`
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Recursos:</span>
              <span className="ml-2 font-medium">
                {lesson.resources?.length || 0} arquivos
              </span>
            </div>
          </div>

          {/* Badges de status */}
          <div className="flex flex-wrap gap-2">
            {lesson.isPreview && (
              <Badge variant="outline" className="text-xs">
                Preview
              </Badge>
            )}
            {lesson.isRequired && (
              <Badge variant="destructive" className="text-xs">
                Obrigatória
              </Badge>
            )}
            {isCompleted && (
              <Badge variant="default" className="text-xs">
                Concluída
              </Badge>
            )}
            {isFlagged && (
              <Badge variant="destructive" className="text-xs">
                Sinalizada
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comentários e discussão */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Discussão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Tem dúvidas sobre esta lição? Participe da discussão com outros
              alunos.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Ver discussão
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
