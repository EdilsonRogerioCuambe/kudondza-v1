import ByteMDEditor from "@/components/byte-md-editor";
import React from "react";

interface DescriptionProps {
  description: string;
  setDescription: (value: string) => void;
}

export default function Description({
  description,
  setDescription,
}: DescriptionProps) {
  return (
    <div className="space-y-3">
      <label
        className="text-sm font-medium text-foreground/90"
        htmlFor="mod-desc"
      >
        Descrição do Módulo
      </label>
      <p className="text-xs text-muted-foreground">
        Use Markdown para formatar o conteúdo
      </p>
      <div className="border-2 border-border/50 rounded-lg overflow-hidden">
        <ByteMDEditor value={description} onChange={setDescription} />
      </div>
    </div>
  );
}
