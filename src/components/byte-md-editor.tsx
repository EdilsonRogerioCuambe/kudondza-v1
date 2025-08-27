"use client";

import breaks from "@bytemd/plugin-breaks";
import frontmatter from "@bytemd/plugin-frontmatter";
import gemoji from "@bytemd/plugin-gemoji";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import math from "@bytemd/plugin-math";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import mermaid from "@bytemd/plugin-mermaid";
import { Editor } from "@bytemd/react";
import "bytemd/dist/index.css";
import "highlight.js/styles/vs.css";
import { useRef } from "react";
import { toast } from "sonner";

// Plugins do ByteMD
const plugins = [
  gfm(),
  highlight(),
  math(),
  breaks(),
  frontmatter(),
  gemoji(),
  mediumZoom(),
  mermaid(),
];

interface ByteMDEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ByteMDEditor({
  value,
  onChange,
  placeholder = "Digite seu conteúdo aqui...",
  className = "",
}: ByteMDEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Configurações do editor
  const editorConfig = {
    placeholder,
    plugins,
    uploadImages: async (files: File[]) => {
      const results = await Promise.all(
        files.map(async (file) => {
          try {
            const formData = new FormData();
            formData.append("file", file);
            // Sem curso no contexto do editor → marcar como temp
            formData.append("tempUpload", "true");

            const response = await fetch("/api/s3/upload", {
              method: "POST",
              body: formData,
            });
            const json = await response.json();

            if (!response.ok || !json?.success) {
              throw new Error(json?.error || "Falha no upload da imagem");
            }

            const openUrl =
              json.presignedUrl ||
              (json.fileUploadId
                ? `/api/s3/upload?action=access&fileUploadId=${json.fileUploadId}`
                : json.fileUrl);

            return {
              url: openUrl as string,
              alt: file.name,
              title: file.name,
            };
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Erro ao enviar imagem";
            toast.error(message);
            return { url: "", alt: file.name, title: file.name };
          }
        })
      );

      return results;
    },
    locale: {
      write: "Editar",
      preview: "Visualizar",
      writeMode: "Modo de Edição",
      previewMode: "Modo de Visualização",
      help: "Ajuda",
      writeModeHelp: "Digite '/' para comandos rápidos",
      previewModeHelp: "Visualize como ficará o conteúdo",
    },
  };

  return (
    <div className={`bytemd-shadcn w-full ${className}`} ref={editorRef}>
      <Editor
        value={value}
        plugins={plugins}
        onChange={onChange}
        placeholder={placeholder}
        uploadImages={editorConfig.uploadImages}
        locale={editorConfig.locale}
        mode="split"
      />
    </div>
  );
}
