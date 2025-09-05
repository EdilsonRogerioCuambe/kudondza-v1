"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import VideoPlayer from "@/components/video-player";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

interface LessonViewerProps {
  src: string;
  title: string;
  durationSeconds?: number | null;
  className?: string;
  lessonIndex?: number; // 1-based index of current lesson
  totalLessons?: number; // total lessons in module/course
}

export default function LessonViewer({
  src,
  title,
  durationSeconds,
  className,
  lessonIndex,
  totalLessons,
}: LessonViewerProps) {
  const [currentTime, setCurrentTime] = useState(0);

  const hasCountProgress =
    typeof lessonIndex === "number" &&
    typeof totalLessons === "number" &&
    totalLessons > 0;

  const progressPercent = useMemo(() => {
    if (hasCountProgress) {
      const idx = Math.min(Math.max(lessonIndex || 0, 0), totalLessons || 0);
      return Math.min(100, Math.max(0, (idx / (totalLessons || 1)) * 100));
    }
    const d = typeof durationSeconds === "number" ? durationSeconds : 0;
    if (!d || d <= 0) return 0;
    return Math.min(100, Math.max(0, (currentTime / d) * 100));
  }, [
    currentTime,
    durationSeconds,
    hasCountProgress,
    lessonIndex,
    totalLessons,
  ]);

  const formatted = useMemo(() => {
    const fmt = (t: number) => {
      const h = Math.floor(t / 3600);
      const m = Math.floor((t % 3600) / 60);
      const s = Math.floor(t % 60);
      return h > 0
        ? `${h}:${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`
        : `${m}:${s.toString().padStart(2, "0")}`;
    };
    return {
      cur: fmt(currentTime),
      dur: fmt(durationSeconds || 0),
    };
  }, [currentTime, durationSeconds]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-base font-semibold truncate">{title}</h2>
        {hasCountProgress ? (
          <div className="text-xs text-muted-foreground tabular-nums">
            Aula {lessonIndex} de {totalLessons} • {progressPercent.toFixed(0)}%
          </div>
        ) : (
          <div className="text-xs text-muted-foreground tabular-nums">
            {formatted.cur} / {formatted.dur} • {progressPercent.toFixed(0)}%
          </div>
        )}
      </div>

      <Progress value={progressPercent} />

      <Card className="p-0">
        <VideoPlayer src={src} title={title} onTimeUpdate={setCurrentTime} />
      </Card>
    </div>
  );
}
