import { getCategories } from "@/actions/categories/get-categories";
import { createSerie } from "@/actions/course-series/create-serie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { redirect } from "next/navigation";
import ImageUploadField from "../../badges/_components/image-upload-field";
import CategorySelect from "../_components/category-select";

export default async function Page() {
  const categoriesRes = await getCategories({
    page: 1,
    limit: 100,
    isActive: true,
    sortBy: "name",
    sortOrder: "asc",
  });
  const categories =
    categoriesRes.success && categoriesRes.data
      ? categoriesRes.data.categories.map((c) => ({ id: c.id, name: c.name }))
      : [];

  async function action(formData: FormData): Promise<void> {
    "use server";
    const result = await createSerie(formData);
    if (result.success) {
      redirect("/admin/dashboard/course-series");
    }
  }

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Criar Série de Cursos
          </h2>
          <p className="text-muted-foreground">
            Defina título, nível e categoria da série.
          </p>
        </div>
      </div>

      <form action={action} className="max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Nível</Label>
                <Select name="level" defaultValue="BEGINNER">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Iniciante</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediário</SelectItem>
                    <SelectItem value="ADVANCED">Avançado</SelectItem>
                    <SelectItem value="EXPERT">Especialista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CategorySelect categories={categories} />
              <div className="space-y-2">
                <Label>Thumbnail</Label>
                <ImageUploadField
                  label="Capa da série"
                  targetInputId="thumbnail"
                />
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  placeholder="https://..."
                  className="hidden"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sequencial</Label>
              <Select name="isSequential" defaultValue="true">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <Button type="submit">Criar Série</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
