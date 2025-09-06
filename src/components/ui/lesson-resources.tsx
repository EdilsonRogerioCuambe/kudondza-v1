"use client";

import type { LessonResourcesProps, Resource } from "@/@types/course-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Archive,
  Download,
  Eye,
  FileText,
  Image,
  Music,
  Video,
} from "lucide-react";
import { useState } from "react";

export function LessonResources({ resources }: LessonResourcesProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
      case "document":
        return <FileText className="h-5 w-5" aria-hidden="true" />;
      case "image":
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        // eslint-disable-next-line jsx-a11y/alt-text
        return <Image className="h-5 w-5" aria-hidden="true" />;
      case "video":
      case "mp4":
      case "avi":
      case "mov":
        return <Video className="h-5 w-5" aria-hidden="true" />;
      case "audio":
      case "mp3":
      case "wav":
        return <Music className="h-5 w-5" aria-hidden="true" />;
      case "zip":
      case "rar":
      case "7z":
        return <Archive className="h-5 w-5" aria-hidden="true" />;
      default:
        return <FileText className="h-5 w-5" aria-hidden="true" />;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
      case "document":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "image":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "video":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "audio":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "zip":
      case "rar":
      case "7z":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleDownload = async (resource: Resource) => {
    setDownloading(resource.id);
    try {
      // TODO: Implementar download real do recurso
      console.log("Downloading resource:", resource);

      // Simular download
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Implementar lógica de download real
      // const response = await fetch(resource.url);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = resource.title;
      // a.click();
      // window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar recurso:", error);
    } finally {
      setDownloading(null);
    }
  };

  const handleView = (resource: Resource) => {
    // TODO: Implementar visualização do recurso
    window.open(resource.url, "_blank");
  };

  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Recursos da Lição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {resource.title}
                    </h4>
                    {resource.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {resource.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getResourceTypeColor(
                          resource.type
                        )}`}
                      >
                        {resource.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(resource)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    <span className="hidden sm:inline">Ver</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(resource)}
                    disabled={downloading === resource.id}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    <span className="hidden sm:inline">
                      {downloading === resource.id ? "Baixando..." : "Baixar"}
                    </span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Ação em lote */}
          {resources.length > 1 && (
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO: Implementar download em lote
                  console.log("Download all resources");
                }}
                className="w-full flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar todos os recursos
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
