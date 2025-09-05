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
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function SeoForm() {
  const form = useFormContext();
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [seoKeywordInput, setSeoKeywordInput] = useState("");

  // Sincronizar com o form quando ele mudar
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "seoKeywords" && value.seoKeywords) {
        setSeoKeywords(value.seoKeywords);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Inicializar keywords do form
  useEffect(() => {
    const formKeywords = form.getValues("seoKeywords") || [];
    setSeoKeywords(formKeywords);
  }, [form]);
  // Função para adicionar palavra-chave SEO
  const handleAddSeoKeyword = () => {
    const keyword = seoKeywordInput.trim();
    if (keyword && !seoKeywords.includes(keyword)) {
      const newKeywords = [...seoKeywords, keyword];
      setSeoKeywords(newKeywords);
      form.setValue("seoKeywords", newKeywords, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      void form.trigger("seoKeywords");
      setSeoKeywordInput("");
    }
  };

  // Função para remover palavra-chave SEO
  const handleRemoveSeoKeyword = (keywordToRemove: string) => {
    const newKeywords = seoKeywords.filter(
      (keyword: string) => keyword !== keywordToRemove
    );
    setSeoKeywords(newKeywords);
    form.setValue("seoKeywords", newKeywords, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    void form.trigger("seoKeywords");
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
          render={({ field: _field }) => (
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
                  {seoKeywords.map((keyword: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => {
                        handleRemoveSeoKeyword(keyword);
                      }}
                    >
                      {keyword}
                      <X className="h-3 w-3 cursor-pointer" />
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
