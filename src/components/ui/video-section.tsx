"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from "@/components/video-player";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface VideoSectionProps {
  title?: string;
  videoUrl?: string | null;
  poster?: string | null;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export function VideoSection({
  title,
  videoUrl,
  poster,
  description,
  className,
  children,
}: VideoSectionProps) {
  // Determine the video source
  const videoSrc = videoUrl;

  if (!videoSrc) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
            <p className="text-muted-foreground">Nenhum vídeo disponível</p>
          </div>
          {children}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <VideoPlayer src={videoSrc} poster={poster} title={title} />
      {children}
    </>
  );
}
