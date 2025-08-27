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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, SparkleIcon, X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import slugify from "slugify";

type BasicFormProps = {
  categories: Array<{ id: string; name: string }>;
  selectedCategoryId: string;
  availableSubcategories: Array<{ id: string; name: string }>;
};

export default function BasicForm({
  categories,
  selectedCategoryId,
  availableSubcategories,
}: BasicFormProps) {
  const form = useFormContext();
  const [tagInput, setTagInput] = useState("");
  // Função para gerar slug automaticamente
  const handleGenerateSlug = () => {
    const titleValue = form.getValues("title");
    const slug = slugify(titleValue, { lower: true, strict: true });
    form.setValue("slug", slug, { shouldValidate: true });
  };

  // Função para adicionar tag
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.getValues("tags")?.includes(tag)) {
      const currentTags = form.getValues("tags") || [];
      form.setValue("tags", [...currentTags, tag]);
      setTagInput("");
    }
  };

  // Função para remover tag
  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((tag: string) => tag !== tagToRemove)
    );
  };

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Informações Básicas
        </CardTitle>
        <CardDescription>
          Preencha as informações básicas do curso
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Curso</FormLabel>
              <FormControl>
                <Input placeholder="Ex: React do Zero ao Avançado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-end">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="react-do-zero-ao-avancado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" onClick={handleGenerateSlug} variant="outline">
            <SparkleIcon className="mr-2 h-4 w-4" />
            Gerar Slug
          </Button>
        </div>

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição Curta</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Uma breve descrição do curso (máximo 200 caracteres)"
                  {...field}
                  maxLength={200}
                  className="min-h-[100px]"
                />
              </FormControl>
              <div className="text-xs text-muted-foreground text-right">
                {field.value?.length || 0}/200 caracteres
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategoria</FormLabel>
                <Select
                  onValueChange={(v) =>
                    field.onChange(v === "none" ? undefined : v)
                  }
                  value={field.value ?? "none"}
                  disabled={!selectedCategoryId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma subcategoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Sem subcategoria</SelectItem>
                    {availableSubcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Iniciante</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediário</SelectItem>
                    <SelectItem value="ADVANCED">Avançado</SelectItem>
                    <SelectItem value="EXPERT">Especialista</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idioma</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">Inglês</SelectItem>
                    <SelectItem value="es">Espanhol</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite uma tag e pressione Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                  >
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(field.value as string[])?.map(
                    (tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    )
                  )}
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
