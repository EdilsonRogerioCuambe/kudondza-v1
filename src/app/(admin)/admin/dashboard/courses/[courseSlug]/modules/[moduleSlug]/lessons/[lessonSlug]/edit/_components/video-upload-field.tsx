"use client";

import { VideoIcon, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface VideoUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  lessonId?: string;
}

export function VideoUploadField({
  value,
  onChange,
  label,
  placeholder,
  lessonId,
}: VideoUploadFieldProps) {
  const [videoMode, setVideoMode] = useState<"url" | "upload">("url");
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const uploadVideo = useCallback(
    (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      if (lessonId) {
        formData.append("lessonId", lessonId);
      } else {
        formData.append("tempUpload", "true");
      }

      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setVideoProgress(progress);
      };

      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300 && json.success) {
            setVideoProgress(100);
            const openUrl =
              json.presignedUrl ||
              (json.fileUploadId
                ? `/api/s3/upload?action=access&fileUploadId=${json.fileUploadId}`
                : json.fileUrl);
            onChange(openUrl as string);
            toast.success("Upload do vídeo concluído");
          } else {
            throw new Error(json.error || "Falha no upload");
          }
        } catch (e: unknown) {
          const message =
            e instanceof Error ? e.message : "Erro ao enviar vídeo";
          toast.error(message);
        }
      };

      xhr.onerror = () => {
        toast.error("Erro de rede durante upload");
      };

      xhr.open("POST", "/api/s3/upload");
      xhr.send(formData);
    },
    [lessonId, onChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles?.length) return;
      const file = acceptedFiles[0];
      if (!file) return;
      setVideoProgress(1);
      uploadVideo(file);
    },
    [uploadVideo]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "video/*": [] },
  });

  const cancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setVideoProgress(0);
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="flex items-center gap-4 py-1">
        <RadioGroup
          value={videoMode}
          onValueChange={(v) => setVideoMode(v as "url" | "upload")}
          className="flex flex-row gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="url" id="video-mode-url" />
            <Label htmlFor="video-mode-url">URL</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="upload" id="video-mode-upload" />
            <Label htmlFor="video-mode-upload">Upload</Label>
          </div>
        </RadioGroup>
      </div>

      {videoMode === "url" ? (
        <FormControl>
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </FormControl>
      ) : (
        <div
          {...getRootProps({
            className:
              `flex flex-col items-center justify-center gap-3 rounded-md border border-dashed p-6 text-center transition-colors w-full ` +
              `${
                isDragActive
                  ? "bg-accent/40 border-accent"
                  : "hover:bg-accent/30"
              }`,
          })}
        >
          <input {...getInputProps()} />
          <VideoIcon className="h-5 w-5 text-muted-foreground" />
          <div className="text-sm">
            Solte o vídeo aqui, ou clique para selecionar
          </div>
          <div className="text-xs text-muted-foreground">
            Arraste e solte ou clique
          </div>
        </div>
      )}

      {videoMode === "upload" && videoProgress > 0 && videoProgress < 100 && (
        <div className="pt-1 space-y-2">
          <Progress value={videoProgress} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={cancelUpload}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar Upload
          </Button>
        </div>
      )}

      <FormMessage />
    </FormItem>
  );
}
