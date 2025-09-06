"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileIcon, UploadCloudIcon, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface FileUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  accept?: Record<string, string[]>;
  lessonId?: string;
  className?: string;
}

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

export function FileUploadField({
  label,
  value,
  onChange,
  placeholder = "URL do arquivo",
  accept = { "video/*": [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm"] },
  lessonId,
  className,
}: FileUploadFieldProps) {
  const [uploadMode, setUploadMode] = useState<"url" | "upload">("url");
  const [urlInput, setUrlInput] = useState(value || "");
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadSingle = useCallback(
    (
      file: File,
      onProgress: (n: number) => void,
      onSuccess: (url: string) => void
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
      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300 && json.success) {
            onProgress(100);
            const openUrl =
              json.fileUrl ||
              (json.fileUploadId
                ? `/api/s3/upload?action=access&fileUploadId=${json.fileUploadId}`
                : json.presignedUrl);
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
    [lessonId]
  );

  const addUrlMedia = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    toast.success("URL adicionada com sucesso");
  };

  const clearValue = () => {
    setUrlInput("");
    onChange("");
  };

  return (
    <div className={`space-y-3 w-full min-w-0 ${className}`}>
      <Label className="text-sm font-medium">{label}</Label>

      <div className="flex items-center gap-4 py-1">
        <RadioGroup
          value={uploadMode}
          onValueChange={(v) => setUploadMode(v as "url" | "upload")}
          className="flex flex-row gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="url" id="file-mode-url" />
            <Label htmlFor="file-mode-url" className="text-sm">
              URL
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="upload" id="file-mode-upload" />
            <Label htmlFor="file-mode-upload" className="text-sm">
              Upload
            </Label>
          </div>
        </RadioGroup>
      </div>

      {uploadMode === "url" ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder={placeholder}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addUrlMedia()}
              className="flex-1"
            />
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
          accept={accept}
          placeholder="Solte o arquivo aqui, ou clique para selecionar"
          onFiles={(files) => {
            const file = files[0];
            if (!file) return;
            setUploadProgress(1);
            uploadSingle(file, setUploadProgress, (url) => {
              setUrlInput(url);
              onChange(url);
            });
          }}
        />
      )}

      {uploadMode === "upload" &&
        uploadProgress > 0 &&
        uploadProgress < 100 && (
          <div className="pt-1">
            <Progress value={uploadProgress} />
          </div>
        )}

      {value && (
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg min-w-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{value}</div>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearValue}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
