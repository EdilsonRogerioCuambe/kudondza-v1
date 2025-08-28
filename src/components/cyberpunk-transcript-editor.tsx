"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Download, FileText, RotateCcw, Save } from "lucide-react";
import { useState } from "react";

interface CyberpunkTranscriptEditorProps {
  transcript: string | null;
  onSave?: (transcript: string) => Promise<void>;
  className?: string;
}

export default function CyberpunkTranscriptEditor({
  transcript,
  onSave,
  className,
}: CyberpunkTranscriptEditorProps) {
  const [content, setContent] = useState(transcript || "");
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleContentChange = (value: string) => {
    setContent(value);
    setHasChanges(value !== (transcript || ""));
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(content);
    }
    setHasChanges(false);
    setIsEditing(false);
  };

  const handleReset = () => {
    setContent(transcript || "");
    setHasChanges(false);
    setIsEditing(false);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcricao-aula.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = content
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = content.length;

  return (
    <Card
      className={cn(
        "bg-card",
        "border border-border backdrop-blur-sm",
        "relative overflow-hidden",
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M0 40L40 0H20L0 20M40 40V20L20 40%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-8 bg-primary rounded-full" />
            <CardTitle className="text-primary font-mono flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Transcrição da Aula</span>
            </CardTitle>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary hover:text-primary/80 font-mono"
              >
                Editar
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={!hasChanges}
                  className="bg-secondary/20 hover:bg-secondary/30 border border-border text-secondary-foreground hover:text-foreground font-mono disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reverter
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary hover:text-primary/80 font-mono disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              disabled={!content.trim()}
              className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary hover:text-primary/80 font-mono disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-1" />
              Baixar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-4 p-3 bg-secondary/50 rounded-lg border border-border">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary font-mono text-sm">
                {wordCount} palavras
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary font-mono text-sm">
                {charCount} caracteres
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary font-mono text-sm">
                {Math.ceil(wordCount / 200)} min de leitura
              </span>
            </div>
          </div>

          {hasChanges && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary font-mono text-xs">
                Alterações não salvas
              </span>
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Digite ou cole a transcrição da aula aqui... Use markdown para formatação."
            className={cn(
              "min-h-[400px] font-mono text-sm leading-relaxed",
              "bg-secondary/50 border-border text-foreground",
              "placeholder:text-muted-foreground focus:border-primary/50",
              "resize-none transition-all duration-300",
              !isEditing && "cursor-not-allowed opacity-75"
            )}
            disabled={!isEditing}
          />

          {/* Line Numbers */}
          {isEditing && (
            <div className="absolute left-0 top-0 w-12 h-full bg-secondary/30 border-r border-border text-right text-xs text-muted-foreground font-mono select-none pointer-events-none">
              {content.split("\n").map((_, index) => (
                <div key={index} className="px-2 py-1">
                  {index + 1}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-4 p-3 bg-secondary/30 rounded-lg border border-border">
          <p className="text-muted-foreground text-xs font-mono">
            <span className="text-primary">💡 Dica:</span> Use markdown para
            formatação.
            <span className="text-primary">**negrito**</span>,
            <span className="text-primary">*itálico*</span>,
            <span className="text-primary"># títulos</span>,
            <span className="text-primary">- listas</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
