"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Download,
  ExternalLink,
  File,
  FileText,
  Image,
  Link,
  Video,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  url: string;
  type: string;
}

interface CyberpunkResourcesProps {
  resources: Resource[];
  className?: string;
}

const getResourceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
    case "document":
      return <FileText className="w-5 h-5" />;
    case "video":
      return <Video className="w-5 h-5" />;
    case "image":
      return <Image className="w-5 h-5" />;
    case "link":
      return <Link className="w-5 h-5" />;
    default:
      return <File className="w-5 h-5" />;
  }
};

const getResourceTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return "bg-destructive/20 text-destructive border-destructive/30";
    case "document":
      return "bg-primary/20 text-primary border-primary/30";
    case "video":
      return "bg-primary/20 text-primary border-primary/30";
    case "image":
      return "bg-primary/20 text-primary border-primary/30";
    case "link":
      return "bg-primary/20 text-primary border-primary/30";
    default:
      return "bg-secondary/20 text-secondary-foreground border-border";
  }
};

export default function CyberpunkResources({
  resources,
  className,
}: CyberpunkResourcesProps) {
  if (!resources || resources.length === 0) {
    return (
      <Card
        className={cn(
          "bg-card",
          "border border-border backdrop-blur-sm",
          "relative overflow-hidden",
          className
        )}
      >
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <File className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-mono text-sm">
            Nenhum recurso disponível
          </p>
        </CardContent>

        {/* Cyberpunk Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M0 40L40 0H20L0 20M40 40V20L20 40%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-2 h-8 bg-primary rounded-full" />
        <h3 className="text-xl font-bold text-primary font-mono">
          Recursos da Aula
        </h3>
        <div className="flex-1 h-px bg-primary/50" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((resource, index) => (
          <Card
            key={resource.id}
            className={cn(
              "group relative overflow-hidden transition-all duration-300",
              "bg-card",
              "border border-border backdrop-blur-sm",
              "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
              "hover:scale-[1.02] hover:-translate-y-1"
            )}
          >
            {/* Animated Border */}
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2210%22 cy=%2210%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />

            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      "bg-muted",
                      "border border-border"
                    )}
                  >
                    {getResourceIcon(resource.type)}
                  </div>
                  <div>
                    <CardTitle className="text-primary font-mono text-base group-hover:text-primary/80 transition-colors">
                      {resource.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={cn(
                        "mt-1 text-xs font-mono",
                        getResourceTypeColor(resource.type)
                      )}
                    >
                      {resource.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground font-mono">
                  #{String(index + 1).padStart(2, "0")}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 relative z-10">
              {resource.description && (
                <p className="text-muted-foreground text-sm mb-4 font-mono leading-relaxed">
                  {resource.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground font-mono">
                    Disponível para download
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(resource.url, "_blank")}
                    className="h-8 px-3 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary hover:text-primary/80 text-xs font-mono"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Abrir
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = resource.url;
                      link.download = resource.title;
                      link.click();
                    }}
                    className="h-8 px-3 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary hover:text-primary/80 text-xs font-mono"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Baixar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
