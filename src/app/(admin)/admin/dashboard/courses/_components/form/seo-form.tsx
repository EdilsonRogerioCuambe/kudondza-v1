import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { Search, X } from "lucide-react";
import React from "react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function SeoForm() {
  const form = useFormContext();
  const [seoKeywordInput, setSeoKeywordInput] = useState("");
  // Função para adicionar palavra-chave SEO
  const handleAddSeoKeyword = () => {
    const keyword = seoKeywordInput.trim();
    if (keyword && !form.getValues("seoKeywords")?.includes(keyword)) {
      const currentKeywords = form.getValues("seoKeywords") || [];
      form.setValue("seoKeywords", [...currentKeywords, keyword]);
      setSeoKeywordInput("");
    }
  };

  // Função para remover palavra-chave SEO
  const handleRemoveSeoKeyword = (keywordToRemove: string) => {
    const currentKeywords = form.getValues("seoKeywords") || [];
    form.setValue(
      "seoKeywords",
      currentKeywords.filter((keyword: string) => keyword !== keywordToRemove)
    );
  };

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          SEO e Otimização
        </CardTitle>
        <CardDescription>
          Configure as informações de SEO para melhorar a visibilidade do curso
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="seoTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título SEO</FormLabel>
              <FormControl>
                <Input placeholder="Título otimizado para SEO" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição SEO</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição otimizada para SEO (máximo 160 caracteres)"
                  {...field}
                  maxLength={160}
                />
              </FormControl>
              <div className="text-xs text-muted-foreground text-right">
                {field.value?.length || 0}/160 caracteres
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Palavras-chave SEO</FormLabel>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite uma palavra-chave e pressione Enter"
                    value={seoKeywordInput}
                    onChange={(e) => setSeoKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSeoKeyword();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddSeoKeyword}
                    variant="outline"
                  >
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {field.value?.map((keyword: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {keyword}
                      <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveSeoKeyword(keyword)}
                      />
                    </Badge>
                    ))}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
