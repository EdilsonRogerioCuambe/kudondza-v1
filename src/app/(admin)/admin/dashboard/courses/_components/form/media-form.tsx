import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FileIcon,
  ImageIcon,
  UploadCloudIcon,
  VideoIcon,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

type MediaFormProps = {
  courseId?: string;
};

type UploadItem = {
  id: string;
  file: File;
  progress: number;
  status: "queued" | "uploading" | "completed" | "error";
  url?: string;
  error?: string;
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
    multiple: false,
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

export default function MediaForm({ courseId }: MediaFormProps) {
  const form = useFormContext();
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const xhrRefs = useRef<Record<string, XMLHttpRequest>>({});
  const _thumbInputRef = useRef<HTMLInputElement | null>(null);
  const _videoInputRef = useRef<HTMLInputElement | null>(null);
  const _materialInputRef = useRef<HTMLInputElement | null>(null);
  const [thumbProgress, setThumbProgress] = useState<number>(0);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [materialsProgress, setMaterialsProgress] = useState<number>(0);
  const [thumbMode, setThumbMode] = useState<"url" | "upload">("url");
  const [trailerMode, setTrailerMode] = useState<"url" | "upload">("url");
  const [materialsMode, setMaterialsMode] = useState<"url" | "upload">("url");
  const [showBulkDropzone, setShowBulkDropzone] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles?.length) return;
    const newItems: UploadItem[] = acceptedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
        .toString(36)
        .slice(2)}`,
      file,
      progress: 0,
      status: "queued",
    }));
    setUploads((prev) => [...newItems, ...prev]);
    newItems.forEach((item) => uploadFile(item));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
      "video/*": [],
      "application/pdf": [],
      "application/zip": [],
    },
  });

  const prettySize = useCallback((size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  const uploadFile = useCallback(
    (item: UploadItem) => {
      const formData = new FormData();
      formData.append("file", item.file);
      if (courseId) {
        formData.append("courseId", courseId);
      } else {
        formData.append("tempUpload", "true");
      }

      const xhr = new XMLHttpRequest();
      xhrRefs.current[item.id] = xhr;

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploads((prev) =>
          prev.map((u) =>
            u.id === item.id ? { ...u, progress, status: "uploading" } : u
          )
        );
      };

      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300 && json.success) {
            const openUrl =
              json.presignedUrl ||
              (json.fileUploadId
                ? `/api/s3/upload?action=access&fileUploadId=${json.fileUploadId}`
                : json.fileUrl);
            setUploads((prev) =>
              prev.map((u) =>
                u.id === item.id
                  ? {
                      ...u,
                      progress: 100,
                      status: "completed",
                      url: openUrl,
                    }
                  : u
              )
            );
            // auto-fill helpful fields
            const isImage = item.file.type.startsWith("image/");
            if (isImage && !form.getValues("thumbnail")) {
              form.setValue("thumbnail", json.fileUrl, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }
            toast.success("Upload concluído");
          } else {
            throw new Error(json.error || "Falha no upload");
          }
        } catch (e: unknown) {
          const message =
            e instanceof Error ? e.message : "Erro ao enviar arquivo";
          setUploads((prev) =>
            prev.map((u) =>
              u.id === item.id ? { ...u, status: "error", error: message } : u
            )
          );
          toast.error(message);
        } finally {
          delete xhrRefs.current[item.id];
        }
      };

      xhr.onerror = () => {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === item.id
              ? { ...u, status: "error", error: "Erro de rede" }
              : u
          )
        );
        delete xhrRefs.current[item.id];
        toast.error("Erro de rede durante upload");
      };

      setUploads((prev) =>
        prev.map((u) =>
          u.id === item.id ? { ...u, status: "uploading", progress: 1 } : u
        )
      );
      xhr.open("POST", "/api/s3/upload");
      xhr.send(formData);
    },
    [courseId, form]
  );

  const cancelUpload = useCallback((id: string) => {
    const xhr = xhrRefs.current[id];
    if (xhr) {
      xhr.abort();
      delete xhrRefs.current[id];
    }
    setUploads((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: "error", error: "Cancelado" } : u
      )
    );
  }, []);

  const uploadSingle = useCallback(
    (
      file: File,
      onProgress: (n: number) => void,
      onSuccess: (url: string) => void
    ) => {
      const formData = new FormData();
      formData.append("file", file);
      if (courseId) {
        formData.append("courseId", courseId);
      } else {
        formData.append("tempUpload", "true");
      }

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      };
      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300 && json.success) {
            onProgress(100);
            const openUrl =
              json.presignedUrl ||
              (json.fileUploadId
                ? `/api/s3/upload?action=access&fileUploadId=${json.fileUploadId}`
                : json.fileUrl);
            onSuccess(openUrl as string);
            toast.success("Upload concluído");
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
    [courseId]
  );

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Mídia e Arquivos
        </CardTitle>
        <CardDescription>
          Adicione imagens, vídeos e materiais do curso
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Uploads em massa (opcional)</div>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setShowBulkDropzone((v) => !v)}
          >
            {showBulkDropzone ? "Fechar" : "Abrir"}
          </Button>
        </div>
        {showBulkDropzone && (
          <div
            {...getRootProps({
              className:
                `flex flex-col items-center justify-center gap-3 rounded-md border border-dashed p-6 text-center transition-colors ` +
                `${
                  isDragActive
                    ? "bg-accent/40 border-accent"
                    : "hover:bg-accent/30"
                }`,
            })}
          >
            <input {...getInputProps()} />
            <UploadCloudIcon className="h-6 w-6 text-muted-foreground" />
            <div className="text-sm font-medium">
              Arraste arquivos aqui, ou clique para selecionar
            </div>
            <div className="text-xs text-muted-foreground">
              Imagens, vídeos, PDF, ZIP
            </div>
          </div>
        )}

        {uploads.length > 0 && (
          <div className="space-y-3">
            {uploads.map((u) => {
              const icon = u.file.type.startsWith("image/") ? (
                <ImageIcon className="h-4 w-4" />
              ) : u.file.type.startsWith("video/") ? (
                <VideoIcon className="h-4 w-4" />
              ) : (
                <FileIcon className="h-4 w-4" />
              );
              return (
                <div key={u.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {icon}
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {u.file.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {prettySize(u.file.size)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {u.status === "uploading" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => cancelUpload(u.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      {u.url && (
                        <a
                          className="text-xs underline"
                          href={u.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Abrir
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={u.progress} />
                    <div className="mt-1 text-xs">
                      {u.status === "completed"
                        ? "Concluído"
                        : u.status === "error"
                        ? u.error || "Erro"
                        : `${u.progress}%`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <div className="flex items-center gap-4 py-1">
                <RadioGroup
                  value={thumbMode}
                  onValueChange={(v) => setThumbMode(v as "url" | "upload")}
                  className="flex flex-row gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="url" id="thumb-mode-url" />
                    <Label htmlFor="thumb-mode-url">URL</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="upload" id="thumb-mode-upload" />
                    <Label htmlFor="thumb-mode-upload">Upload</Label>
                  </div>
                </RadioGroup>
              </div>
              {thumbMode === "url" ? (
                <FormControl>
                  <Input placeholder="URL da imagem de capa" {...field} />
                </FormControl>
              ) : (
                <FieldDropzone
                  accept={{ "image/*": [] }}
                  placeholder="Solte a imagem de capa aqui"
                  onFiles={(files) => {
                    const file = files[0];
                    if (!file) return;
                    setThumbProgress(1);
                    uploadSingle(file, setThumbProgress, (url) =>
                      form.setValue("thumbnail", url, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    );
                  }}
                />
              )}
              {thumbMode === "upload" &&
                thumbProgress > 0 &&
                thumbProgress < 100 && (
                  <div className="pt-1">
                    <Progress value={thumbProgress} />
                  </div>
                )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trailer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vídeo Trailer</FormLabel>
              <div className="flex items-center gap-4 py-1">
                <RadioGroup
                  value={trailerMode}
                  onValueChange={(v) => setTrailerMode(v as "url" | "upload")}
                  className="flex flex-row gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="url" id="trailer-mode-url" />
                    <Label htmlFor="trailer-mode-url">URL</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="upload" id="trailer-mode-upload" />
                    <Label htmlFor="trailer-mode-upload">Upload</Label>
                  </div>
                </RadioGroup>
              </div>
              {trailerMode === "url" ? (
                <FormControl>
                  <Input
                    placeholder="URL do vídeo trailer (YouTube, Vimeo, etc.)"
                    {...field}
                  />
                </FormControl>
              ) : (
                <FieldDropzone
                  accept={{ "video/*": [] }}
                  placeholder="Solte o vídeo trailer aqui"
                  onFiles={(files) => {
                    const file = files[0];
                    if (!file) return;
                    setVideoProgress(1);
                    uploadSingle(file, setVideoProgress, (url) =>
                      form.setValue("trailer", url, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    );
                  }}
                />
              )}
              {trailerMode === "upload" &&
                videoProgress > 0 &&
                videoProgress < 100 && (
                  <div className="pt-1">
                    <Progress value={videoProgress} />
                  </div>
                )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="courseMaterials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Materiais do Curso</FormLabel>
              <div className="flex items-center gap-4 py-1">
                <RadioGroup
                  value={materialsMode}
                  onValueChange={(v) => setMaterialsMode(v as "url" | "upload")}
                  className="flex flex-row gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="url" id="materials-mode-url" />
                    <Label htmlFor="materials-mode-url">URL</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="upload" id="materials-mode-upload" />
                    <Label htmlFor="materials-mode-upload">Upload</Label>
                  </div>
                </RadioGroup>
              </div>
              {materialsMode === "url" ? (
                <FormControl>
                  <Input
                    placeholder="URL para materiais complementares"
                    {...field}
                  />
                </FormControl>
              ) : (
                <FieldDropzone
                  accept={{ "*/*": [] }}
                  placeholder="Solte o material do curso aqui"
                  onFiles={(files) => {
                    const file = files[0];
                    if (!file) return;
                    setMaterialsProgress(1);
                    uploadSingle(file, setMaterialsProgress, (url) =>
                      form.setValue("courseMaterials", url, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    );
                  }}
                />
              )}
              {materialsMode === "upload" &&
                materialsProgress > 0 &&
                materialsProgress < 100 && (
                  <div className="pt-1">
                    <Progress value={materialsProgress} />
                  </div>
                )}
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
