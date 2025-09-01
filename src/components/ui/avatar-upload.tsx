"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface AvatarUploadProps {
  currentAvatar?: string;
  currentName?: string;
  onAvatarChange: (url: string) => void;
  className?: string;
}

export function AvatarUpload({
  currentAvatar,
  currentName,
  onAvatarChange,
  className,
}: AvatarUploadProps) {
  const [avatarMode, setAvatarMode] = useState<"url" | "upload">("upload");
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar || "");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tempUpload", "true");
      formData.append("isAvatar", "true");

      const xhr = new XMLHttpRequest();
      setIsUploading(true);
      setUploadProgress(0);

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      };

      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300 && json.success) {
            const fileUrl = json.fileUrl;
            setAvatarUrl(fileUrl);
            onAvatarChange(fileUrl);
            toast.success("Avatar atualizado com sucesso");
          } else {
            throw new Error(json.error || "Falha no upload");
          }
        } catch (e: unknown) {
          const message =
            e instanceof Error ? e.message : "Erro ao enviar arquivo";
          toast.error(message);
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      };

      xhr.onerror = () => {
        toast.error("Erro de rede durante upload");
        setIsUploading(false);
        setUploadProgress(0);
      };

      xhr.open("POST", "/api/s3/upload");
      xhr.send(formData);
    },
    [onAvatarChange]
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione apenas imagens");
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    uploadFile(file);
  };

  const handleUrlChange = (url: string) => {
    setAvatarUrl(url);
    onAvatarChange(url);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview do Avatar */}
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={avatarUrl} alt="Avatar" />
          <AvatarFallback className="text-lg">
            {getInitials(currentName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Avatar</h3>
          <p className="text-sm text-muted-foreground">
            Escolha uma imagem para seu perfil
          </p>
        </div>
      </div>

      {/* Modos de Upload */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="avatarMode"
            value="upload"
            checked={avatarMode === "upload"}
            onChange={(e) => setAvatarMode(e.target.value as "url" | "upload")}
            className="sr-only"
          />
          <div
            className={`px-3 py-2 rounded-md border ${
              avatarMode === "upload"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border"
            }`}
          >
            Upload
          </div>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="avatarMode"
            value="url"
            checked={avatarMode === "url"}
            onChange={(e) => setAvatarMode(e.target.value as "url" | "upload")}
            className="sr-only"
          />
          <div
            className={`px-3 py-2 rounded-md border ${
              avatarMode === "url"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border"
            }`}
          >
            URL
          </div>
        </label>
      </div>

      {/* Upload por Arquivo */}
      {avatarMode === "upload" && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Selecionar arquivo de imagem"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            <IconUpload className="h-4 w-4 mr-2" />
            {isUploading ? "Enviando..." : "Escolher Imagem"}
          </Button>
          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-muted-foreground text-center">
                {uploadProgress}% concluído
              </p>
            </div>
          )}
        </div>
      )}

      {/* Upload por URL */}
      {avatarMode === "url" && (
        <div className="space-y-2">
          <input
            type="url"
            placeholder="https://exemplo.com/imagem.jpg"
            value={avatarUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Remover Avatar */}
      {avatarUrl && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setAvatarUrl("");
            onAvatarChange("");
          }}
          className="w-full"
        >
          <IconX className="h-4 w-4 mr-2" />
          Remover Avatar
        </Button>
      )}
    </div>
  );
}
