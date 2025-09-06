"use client";

import {
  FileIcon,
  ImageIcon,
  MusicIcon,
  UploadCloudIcon,
  VideoIcon,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  createResource,
  deleteResource,
} from "@/actions/courses/modules/lesson-resources";

interface MediaFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  url?: string;
  duration?: number; // Para vídeos
  error?: string;
  resourceId?: string; // ID do resource salvo no banco
}

interface MediaUploadFieldProps {
  value: MediaFile[];
  onChange: (files: MediaFile[]) => void;
  label: string;
  placeholder: string;
  lessonId?: string;
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("video/")) return VideoIcon;
  if (fileType.startsWith("audio/")) return MusicIcon;
  if (fileType.startsWith("image/")) return ImageIcon;
  return FileIcon;
};

const getFileType = (
  fileType: string
): "PDF" | "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | "LINK" | "CODE" => {
  if (fileType.startsWith("video/")) return "VIDEO";
  if (fileType.startsWith("audio/")) return "AUDIO";
  if (fileType.startsWith("image/")) return "IMAGE";
  if (fileType.includes("pdf")) return "PDF";
  if (fileType.includes("document") || fileType.includes("text"))
    return "DOCUMENT";
  if (
    fileType.includes("code") ||
    fileType.includes("javascript") ||
    fileType.includes("typescript")
  )
    return "CODE";
  return "LINK";
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

function FieldDropzone({
  accept,
  onFiles,
  placeholder,
}: {
  accept: Record<string, string[]>;
  onFiles: (files: File[]) => void;
  placeholder: string;
}) {
  const onDropLocal = useCallback(
    (files: File[]) => {
      if (!files?.length) return;
      onFiles(files);
    },
    [onFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropLocal,
    multiple: true,
    accept,
  });
  return (
    <div
      {...getRootProps({
        className:
          `flex flex-col items-center justify-center gap-3 rounded-md border border-dashed p-6 text-center transition-colors w-full ` +
          `${
            isDragActive ? "bg-accent/40 border-accent" : "hover:bg-accent/30"
          }`,
      })}
    >
      <input {...getInputProps()} />
      <UploadCloudIcon className="h-5 w-5 text-muted-foreground" />
      <div className="text-sm">{placeholder}</div>
      <div className="text-xs text-muted-foreground">
        Arraste e solte ou clique
      </div>
    </div>
  );
}

export function MediaUploadField({
  value = [],
  onChange,
  label,
  placeholder,
  lessonId,
}: MediaUploadFieldProps) {
  const [uploadMode, setUploadMode] = useState<"url" | "upload">("upload");
  const [urlInput, setUrlInput] = useState("");
  const xhrRefs = useRef<Map<string, XMLHttpRequest>>(new Map());

  const getVideoDuration = useCallback((file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("video/")) {
        resolve(0);
        return;
      }

      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.floor(video.duration));
      };

      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error("Erro ao carregar vídeo"));
      };

      video.src = URL.createObjectURL(file);
    });
  }, []);

  const uploadSingle = useCallback(
    (
      file: File,
      onProgress: (n: number) => void,
      onSuccess: (url: string, duration?: number, resourceId?: string) => void
    ) => {
      const formData = new FormData();
      formData.append("file", file);
      if (lessonId) {
        formData.append("lessonId", lessonId);
      } else {
        formData.append("tempUpload", "true");
      }

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      };
      xhr.onload = async () => {
        try {
          const json = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300 && json.success) {
            onProgress(100);
            const openUrl =
              json.fileUrl ||
              (json.fileUploadId
                ? `/api/s3/upload?action=access&fileUploadId=${json.fileUploadId}`
                : json.presignedUrl);

            // Obter duração do vídeo se for um arquivo de vídeo
            let duration = 0;
            if (file.type.startsWith("video/")) {
              try {
                duration = await getVideoDuration(file);
              } catch (error) {
                console.warn("Erro ao obter duração do vídeo:", error);
              }
            }

            // Salvar no modelo Resource
            const resourceType = getFileType(file.type);
            const resourceResult = await createResource({
              title: file.name,
              description: `Arquivo ${file.name}`,
              type: resourceType,
              url: openUrl as string,
              fileSize: file.size,
              mimeType: file.type,
              downloadable: true,
              lessonId: lessonId!,
            });

            if (resourceResult.success && resourceResult.data) {
              onSuccess(openUrl as string, duration, resourceResult.data.id);
              toast.success("Upload concluído");
            } else {
              throw new Error("Erro ao salvar resource");
            }
          } else {
            throw new Error(json.error || "Falha no upload");
          }
        } catch (e: unknown) {
          const message =
            e instanceof Error ? e.message : "Erro ao enviar arquivo";
          toast.error(message);
        }
      };
      xhr.onerror = () => {
        toast.error("Erro de rede durante upload");
      };
      xhr.open("POST", "/api/s3/upload");
      xhr.send(formData);
    },
    [lessonId, getVideoDuration]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles?.length) return;

      const newMediaFiles: MediaFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: "uploading" as const,
      }));

      const updatedValue = [...value, ...newMediaFiles];
      onChange(updatedValue);

      // Iniciar upload de cada arquivo
      newMediaFiles.forEach((mediaFile) => {
        uploadSingle(
          mediaFile.file,
          (progress) => {
            onChange(
              updatedValue.map((media) =>
                media.id === mediaFile.id ? { ...media, progress } : media
              )
            );
          },
          (url, duration, resourceId) => {
            onChange(
              updatedValue.map((media) =>
                media.id === mediaFile.id
                  ? {
                      ...media,
                      status: "completed" as const,
                      progress: 100,
                      url,
                      duration,
                      resourceId,
                    }
                  : media
              )
            );
          }
        );
      });
    },
    [value, onChange, uploadSingle]
  );

  const removeFile = async (mediaId: string) => {
    // Encontrar o arquivo para obter o resourceId
    const mediaFile = value.find((media) => media.id === mediaId);

    // Cancelar upload se estiver em andamento
    const xhr = xhrRefs.current.get(mediaId);
    if (xhr) {
      xhr.abort();
      xhrRefs.current.delete(mediaId);
    }

    // Deletar do banco se tiver resourceId
    if (mediaFile?.resourceId) {
      try {
        await deleteResource(mediaFile.resourceId);
        toast.success("Arquivo removido com sucesso");
      } catch (error) {
        console.error("Erro ao deletar resource:", error);
        toast.error("Erro ao remover arquivo");
      }
    }

    onChange(value.filter((media) => media.id !== mediaId));
  };

  const addUrlMedia = async () => {
    if (!urlInput.trim()) return;

    try {
      // Salvar URL no modelo Resource
      const resourceResult = await createResource({
        title: urlInput.trim(),
        description: `URL: ${urlInput.trim()}`,
        type: "LINK",
        url: urlInput.trim(),
        downloadable: false,
        lessonId: lessonId!,
      });

      if (resourceResult.success && resourceResult.data) {
        const newMediaFile: MediaFile = {
          id: Math.random().toString(36).substr(2, 9),
          file: new File([], "url-media", { type: "text/plain" }),
          progress: 100,
          status: "completed",
          url: urlInput.trim(),
          resourceId: resourceResult.data.id,
        };

        onChange([...value, newMediaFile]);
        setUrlInput("");
        toast.success("URL adicionada com sucesso");
      } else {
        throw new Error("Erro ao salvar URL");
      }
    } catch (error) {
      console.error("Erro ao adicionar URL:", error);
      toast.error("Erro ao adicionar URL");
    }
  };

  return (
    <FormItem className="min-w-0">
      <FormLabel>{label}</FormLabel>

      <div className="flex items-center gap-4 py-1">
        <RadioGroup
          value={uploadMode}
          onValueChange={(v) => setUploadMode(v as "url" | "upload")}
          className="flex flex-row gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="upload" id="media-mode-upload" />
            <Label htmlFor="media-mode-upload">Upload</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="url" id="media-mode-url" />
            <Label htmlFor="media-mode-url">URL</Label>
          </div>
        </RadioGroup>
      </div>

      {uploadMode === "url" ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <FormControl>
              <Input
                placeholder={placeholder}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addUrlMedia()}
                className="flex-1"
              />
            </FormControl>
            <Button
              type="button"
              onClick={addUrlMedia}
              disabled={!urlInput.trim()}
            >
              Adicionar
            </Button>
          </div>
        </div>
      ) : (
        <FieldDropzone
          accept={{
            "video/*": [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm"],
            "audio/*": [".mp3", ".wav", ".ogg", ".aac", ".m4a"],
            "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              [".docx"],
            "application/vnd.ms-powerpoint": [".ppt"],
            "application/vnd.openxmlformats-officedocument.presentationml.presentation":
              [".pptx"],
          }}
          placeholder="Solte os arquivos aqui, ou clique para selecionar"
          onFiles={onDrop}
        />
      )}

      {/* Lista de arquivos */}
      {value.length > 0 && (
        <div className="space-y-3 mt-4 min-w-0">
          <Label className="text-sm font-medium">
            Arquivos ({value.length})
          </Label>
          <div className="space-y-2 min-w-0">
            {value.map((media) => {
              const FileIconComponent = getFileIcon(media.file.type);
              const fileType = getFileType(media.file.type);

              return (
                <Card key={media.id} className="p-3 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileIconComponent className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">
                                {media.file.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Badge
                                variant="secondary"
                                className="text-xs px-1 py-0"
                              >
                                {fileType}
                              </Badge>
                              {media.duration && media.duration > 0 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                >
                                  {formatDuration(media.duration)}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {formatFileSize(media.file.size)}
                          </p>
                          {media.status === "uploading" && (
                            <div className="mt-2 min-w-0">
                              <Progress
                                value={media.progress}
                                className="h-1"
                              />
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {media.progress}% enviado
                              </p>
                            </div>
                          )}
                          {media.status === "error" && media.error && (
                            <p className="text-xs text-destructive mt-1 truncate">
                              {media.error}
                            </p>
                          )}
                          {media.status === "completed" && (
                            <p className="text-xs text-green-600 mt-1 truncate">
                              ✓ Upload concluído
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(media.id)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <FormMessage />
    </FormItem>
  );
}
