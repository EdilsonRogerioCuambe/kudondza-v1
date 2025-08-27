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
import { FileText } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";
import { useFormContext } from "react-hook-form";

const ByteMDEditor = dynamic(() => import("@/components/byte-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-lg bg-muted flex items-center justify-center">
      <div className="text-muted-foreground">Carregando editor...</div>
    </div>
  ),
});

export default function ContentForm() {
  const form = useFormContext();

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Descrição Detalhada
        </CardTitle>
        <CardDescription>
          Crie uma descrição completa do curso usando o editor Markdown
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Curso</FormLabel>
              <FormControl>
                <div className="border rounded-lg">
                  <ByteMDEditor
                    value={field.value || ""}
                    onChange={(value) => field.onChange(value)}
                    placeholder="Digite a descrição do curso..."
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
