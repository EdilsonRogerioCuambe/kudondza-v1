"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export default function ImageUploadField({
  label,
  value,
  onChange,
  targetInputId,
}: {
  label?: string;
  value?: string;
  onChange?: (url: string) => void;
  targetInputId?: string;
}) {
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onPick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Selecione uma imagem válida");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("tempUpload", "true");

      const xhr = new XMLHttpRequest();
      setIsUploading(true);

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const pct = Math.round((event.loaded / event.total) * 100);
        setProgress(pct);
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
            setProgress(100);
            if (onChange) onChange(openUrl as string);
            if (targetInputId) {
              const input = document.getElementById(
                targetInputId
              ) as HTMLInputElement | null;
              if (input) input.value = openUrl as string;
            }
            toast.success("Upload concluído");
          } else {
            throw new Error(json.error || "Falha no upload");
          }
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Erro no upload";
          toast.error(message);
        } finally {
          setIsUploading(false);
        }
      };

      xhr.onerror = () => {
        toast.error("Erro de rede durante upload");
        setIsUploading(false);
      };

      xhr.open("POST", "/api/s3/upload");
      xhr.send(formData);
    },
    [onChange, targetInputId]
  );

  return (
    <div className="space-y-2">
      {label ? <Label>{label}</Label> : null}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPick}
          disabled={isUploading}
        >
          {isUploading
            ? "Enviando..."
            : value
            ? "Trocar imagem"
            : "Enviar imagem"}
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
      </div>
      {isUploading ? <Progress value={progress} /> : null}
      {value ? (
        <div className="relative mt-2 h-28 w-28 overflow-hidden rounded-md border">
          <Image src={value} alt="Badge image" fill className="object-cover" />
        </div>
      ) : null}
    </div>
  );
}
