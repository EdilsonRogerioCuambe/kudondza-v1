"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Settings,
  SkipBack,
  SkipForward,
  Subtitles,
  Type,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type VideoPlayerProps = {
  src: string;
  poster?: string | null;
  title?: string;
  className?: string;
  // Optional: external handlers
  onTimeUpdate?(current: number): void;
  onEnded?(): void;
  // Security toggles (best-effort; cannot fully prevent network-level downloads)
  disallowPiP?: boolean;
  disallowDownload?: boolean;
};

export default function VideoPlayer({
  src,
  poster,
  title,
  className,
  onTimeUpdate,
  onEnded,
  disallowPiP = true,
  disallowDownload = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isHovering, setIsHovering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const hideTimer = useRef<number | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seek(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          seek(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume(Math.min(volume + 0.1, 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume(Math.max(volume - 0.1, 0));
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
  }, [volume]);

  // Check if video is already loaded when component mounts
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // If video is already ready, don't show loading
    if (v.readyState >= 2) {
      // HAVE_CURRENT_DATA
      setIsLoading(false);
    }
  }, [src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const timeupdate = () => {
      setProgress(v.currentTime);
      if (onTimeUpdate) onTimeUpdate(v.currentTime);
    };
    const loadedmetadata = () => {
      setDuration(v.duration || 0);
      setIsLoading(false);
    };
    const canplay = () => {
      setIsLoading(false);
    };
    const ended = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    const loadstart = () => {
      // Only show loading if video is not already ready
      if (v.readyState < 2) {
        setIsLoading(true);
      }
    };
    const waiting = () => {
      setIsLoading(true);
    };
    const playing = () => {
      setIsLoading(false);
    };
    const canplaythrough = () => {
      setIsLoading(false);
    };

    v.addEventListener("timeupdate", timeupdate);
    v.addEventListener("loadedmetadata", loadedmetadata);
    v.addEventListener("canplay", canplay);
    v.addEventListener("ended", ended);
    v.addEventListener("loadstart", loadstart);
    v.addEventListener("waiting", waiting);
    v.addEventListener("playing", playing);
    v.addEventListener("canplaythrough", canplaythrough);

    return () => {
      v.removeEventListener("timeupdate", timeupdate);
      v.removeEventListener("loadedmetadata", loadedmetadata);
      v.removeEventListener("canplay", canplay);
      v.removeEventListener("ended", ended);
      v.removeEventListener("loadstart", loadstart);
      v.removeEventListener("waiting", waiting);
      v.removeEventListener("playing", playing);
      v.removeEventListener("canplaythrough", canplaythrough);
    };
  }, [onEnded, onTimeUpdate]);

  useEffect(() => {
    const onFull = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFull);
    return () => document.removeEventListener("fullscreenchange", onFull);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const seek = (seconds: number) => {
    const v = videoRef.current;
    if (!v) return;
    const newTime = Math.max(0, Math.min(v.currentTime + seconds, duration));
    v.currentTime = newTime;
    setProgress(newTime);
  };

  const handleSeek = (val: number[]) => {
    const v = videoRef.current;
    if (!v) return;
    const to = Math.min(Math.max(val[0] ?? 0, 0), duration || 0);
    v.currentTime = to;
    setProgress(to);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      await container.requestFullscreen().catch(() => {});
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.muted || v.volume === 0) {
      v.muted = false;
      v.volume = volume || 0.9;
    } else {
      v.muted = true;
    }
    setVolume(v.muted ? 0 : v.volume);
  };

  const changePlaybackRate = (rate: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleSubtitles = () => {
    const v = videoRef.current;
    if (!v) return;
    setShowSubtitles(!showSubtitles);
    // Toggle subtitles if available
    if (v.textTracks.length > 0) {
      for (let i = 0; i < v.textTracks.length; i++) {
        v.textTracks[i].mode = showSubtitles ? "hidden" : "showing";
      }
    }
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  const formatted = useMemo(() => {
    const fmt = (t: number) => {
      if (!isFinite(t)) return "0:00";
      const h = Math.floor(t / 3600);
      const m = Math.floor((t % 3600) / 60);
      const s = Math.floor(t % 60);
      return h > 0
        ? `${h}:${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`
        : `${m}:${s.toString().padStart(2, "0")}`;
    };
    return { cur: fmt(progress), dur: fmt(duration) };
  }, [progress, duration]);

  // Auto-hide controls on inactivity
  const onMouseMove = () => {
    setShowControls(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowControls(false), 3000);
  };

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-background border border-border shadow-lg pt-0 pb-0 w-full max-w-4xl mx-auto",
        className
      )}
    >
      <div
        ref={containerRef}
        className="group relative"
        onMouseMove={onMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          if (!videoRef.current?.paused) setShowControls(false);
        }}
        onContextMenu={(e) => disallowDownload && e.preventDefault()}
      >
        <AspectRatio ratio={16 / 9}>
          <video
            ref={videoRef}
            playsInline
            preload="metadata"
            poster={poster ?? undefined}
            controls={false}
            controlsList={
              disallowDownload
                ? "nodownload noplaybackrate noremoteplayback"
                : undefined
            }
            disablePictureInPicture={disallowPiP}
            x-webkit-airplay="deny"
            src={src}
            className="h-full w-full object-cover select-none"
          />

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Play button overlay when paused */}
          {!isPlaying && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="icon"
                className="h-12 w-12 sm:h-16 sm:w-16 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                onClick={togglePlay}
              >
                <Play className="h-6 w-6 sm:h-8 sm:w-8 ml-0.5 sm:ml-1" />
              </Button>
            </div>
          )}
        </AspectRatio>

        {/* Overlay gradient for readability */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/90 via-background/50 to-transparent transition-opacity duration-300",
            showControls || isHovering ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Controls */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 sm:gap-3 p-2 sm:p-4 transition-all duration-300",
            showControls || isHovering
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          )}
        >
          {/* Progress bar */}
          <div className="relative">
            <Slider
              value={[progress]}
              min={0}
              max={Math.max(duration, 0.01)}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full [&>span]:h-1.5 sm:[&>span]:h-2 [&>span]:bg-muted [&>span>span]:bg-primary"
            />
            <div className="absolute -top-6 sm:-top-8 right-0 text-xs text-foreground bg-background/90 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border text-[10px] sm:text-xs">
              {formatted.cur} / {formatted.dur}
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between gap-1 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Play/Pause */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="h-8 w-8 sm:h-10 sm:w-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isPlaying ? "Pausar" : "Reproduzir"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Skip backward - hidden on mobile */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 sm:h-10 sm:w-10 bg-background/80 hover:bg-background text-foreground border-border/50 hidden sm:flex"
                      onClick={() => seek(-10)}
                    >
                      <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Voltar 10s</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Skip forward - hidden on mobile */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 sm:h-10 sm:w-10 bg-background/80 hover:bg-background text-foreground border-border/50 hidden sm:flex"
                      onClick={() => seek(10)}
                    >
                      <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Avançar 10s</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Volume controls */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 sm:h-10 sm:w-10 bg-background/80 hover:bg-background text-foreground border-border/50"
                  onClick={toggleMute}
                >
                  {volume === 0 ? (
                    <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
                <div className="w-16 sm:w-24 hidden sm:block">
                  <Slider
                    value={[volume]}
                    min={0}
                    max={1}
                    step={0.05}
                    onValueChange={(v) => setVolume(v[0] ?? 0)}
                    className="[&>span]:h-1.5 sm:[&>span]:h-2 [&>span]:bg-muted [&>span>span]:bg-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Playback speed - hidden on mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 sm:h-10 sm:w-10 bg-background/80 hover:bg-background text-foreground border-border/50 hidden sm:flex"
                  >
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {playbackRates.map((rate) => (
                    <DropdownMenuItem
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={cn(
                        "cursor-pointer",
                        playbackRate === rate &&
                          "bg-primary text-primary-foreground"
                      )}
                    >
                      {rate}x
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Subtitles - hidden on mobile */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className={cn(
                        "h-8 w-8 sm:h-10 sm:w-10 bg-background/80 hover:bg-background text-foreground border-border/50 hidden sm:flex",
                        showSubtitles && "bg-primary text-primary-foreground"
                      )}
                      onClick={toggleSubtitles}
                    >
                      <Subtitles className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {showSubtitles ? "Ocultar legendas" : "Mostrar legendas"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Settings - hidden on mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 sm:h-10 sm:w-10 bg-background/80 hover:bg-background text-foreground border-border/50 hidden sm:flex"
                  >
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer">
                    <Type className="h-4 w-4 mr-2" />
                    Qualidade
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Resetar configurações
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Fullscreen */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 sm:h-10 sm:w-10 bg-background/80 hover:bg-background text-foreground border-border/50"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? (
                        <Minimize className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFullscreen ? "Sair da tela cheia" : "Tela cheia"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Title (optional) */}
      {title && (
        <div className="px-2 sm:px-4 py-2 sm:py-3 bg-muted/30 border-t">
          <h3 className="text-xs sm:text-sm font-medium text-foreground truncate">
            {title}
          </h3>
        </div>
      )}
    </Card>
  );
}
