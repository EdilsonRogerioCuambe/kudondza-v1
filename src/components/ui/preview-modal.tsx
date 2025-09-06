"use client";

import type { PreviewModalProps } from "@/@types/course-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { VideoSection } from "@/components/ui/video-section";
import { motion } from "framer-motion";
import {
  Clock,
  Download,
  Eye,
  PlayCircle,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function PreviewModal({
  isOpen,
  onClose,
  lesson,
  course,
  module,
}: PreviewModalProps) {
  const hasDiscount =
    course.originalPrice && course.originalPrice > course.price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">
            Preview: {lesson.title}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Aula gratuita do curso {course.title}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Video Player */}
            {lesson.videoUrl ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <VideoSection
                  title="Aula Preview"
                  videoUrl={lesson.videoUrl}
                  className="w-full"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center"
              >
                <PlayCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Vídeo não disponível no preview
                </p>
              </motion.div>
            )}

            {/* Lesson Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate max-w-[200px] sm:max-w-none">
                  {module.title}
                </span>
              </span>
              {lesson.videoDuration && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  {Math.round((Number(lesson.videoDuration) / 60) * 10) / 10}h
                </span>
              )}
              {lesson.xpReward && (
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                  {lesson.xpReward} XP
                </span>
              )}
              {lesson.isRequired && (
                <Badge variant="outline" className="text-xs">
                  <PlayCircle className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Aula Obrigatória</span>
                  <span className="sm:hidden">Obrigatória</span>
                </Badge>
              )}
            </motion.div>

            {/* Description */}
            {lesson.description && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold">Sobre esta lição</h3>
                {/<[^>]+>/.test(lesson.description) ? (
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: lesson.description }}
                  />
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {lesson.description}
                    </ReactMarkdown>
                  </div>
                )}
              </motion.section>
            )}

            {/* Transcript */}
            {lesson.transcript && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold">Transcrição</h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {lesson.transcript}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* Resources */}
            {lesson.resources && lesson.resources.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold">Recursos da lição</h3>
                <div className="grid grid-cols-1 gap-3">
                  {lesson.resources.map((resource) => (
                    <Card key={resource.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          {resource.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground space-y-2">
                        {resource.description && (
                          <p className="line-clamp-2">{resource.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                          <Button variant="link" size="sm" asChild>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Acessar
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar - Course Info */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-4"
            >
              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <span className="truncate">Acesse o curso completo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-2 sm:gap-3">
                    {course.price === 0 ? (
                      <span className="text-xl sm:text-2xl font-semibold text-green-600">
                        Gratuito
                      </span>
                    ) : (
                      <>
                        <span className="text-2xl sm:text-3xl font-bold">
                          {course.currency} {Number(course.price).toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-muted-foreground line-through">
                            {course.currency}{" "}
                            {Number(course.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <Button
                    size="lg"
                    className="w-full text-sm sm:text-base"
                    asChild
                  >
                    <Link href={`/courses/${course.slug}/payment`}>
                      {course.price === 0 ? "Começar agora" : "Assinar curso"}
                    </Link>
                  </Button>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-xs sm:text-sm">
                      O que você recebe:
                    </h4>
                    <ul className="text-xs sm:text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        <span className="leading-relaxed">
                          Acesso mensal completo
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        <span className="leading-relaxed">
                          Certificado de conclusão
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        <span className="leading-relaxed">
                          Atualizações futuras incluídas
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        <span className="leading-relaxed">
                          Suporte da comunidade
                        </span>
                      </li>
                      {course.language && (
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                          <span className="leading-relaxed">
                            Idioma: {course.language}
                          </span>
                        </li>
                      )}
                      {course.duration && (
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                          <span className="leading-relaxed">
                            Carga horária:{" "}
                            {Math.round((Number(course.duration) / 60) * 10) /
                              10}
                            h
                          </span>
                        </li>
                      )}
                      {course.allowDownload && (
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                          <span className="leading-relaxed">
                            Download de materiais incluso
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-muted-foreground">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {course._count?.enrollments || 0} alunos
                      </span>
                    </div>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {course.level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
