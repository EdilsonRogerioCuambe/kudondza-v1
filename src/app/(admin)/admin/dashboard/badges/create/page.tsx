import { createBadge } from "@/actions/badges/create-badge";
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
import CriteriaBuilder from "../_components/criteria-builder";
import ImageUploadField from "../_components/image-upload-field";

export default async function Page() {
  async function action(formData: FormData): Promise<void> {
    "use server";
    const result = await createBadge(formData);
    if (result.success) {
      redirect("/admin/dashboard/badges");
    }
  }

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Criar Badge</h2>
          <p className="text-muted-foreground">
            Defina nome, raridade, XP e critérios para a nova badge.
          </p>
        </div>
      </div>

      <form action={action} className="max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Badge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <ImageUploadField
                label="Imagem da badge"
                value={undefined}
                targetInputId="icon"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Ícone (emoji ou nome)</Label>
                <Input id="icon" name="icon" placeholder=":trophy:" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" rows={3} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rarity">Raridade</Label>
                <Select name="rarity" defaultValue="COMMON">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMMON">Comum</SelectItem>
                    <SelectItem value="UNCOMMON">Incomum</SelectItem>
                    <SelectItem value="RARE">Rara</SelectItem>
                    <SelectItem value="EPIC">Épica</SelectItem>
                    <SelectItem value="LEGENDARY">Lendária</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="xpReward">XP</Label>
                <Input
                  id="xpReward"
                  name="xpReward"
                  type="number"
                  min={0}
                  defaultValue={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Cor (hex)</Label>
                <Input id="color" name="color" defaultValue="#3B82F6" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Ativa</Label>
                <Select name="isActive" defaultValue="true">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sim</SelectItem>
                    <SelectItem value="false">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Limitada</Label>
                <Select name="isLimited" defaultValue="false">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Não</SelectItem>
                    <SelectItem value="true">Sim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expira em</Label>
                <Input id="expiresAt" name="expiresAt" type="datetime-local" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Critérios</Label>
              <CriteriaBuilder inputName="criteria" />
            </div>

            <div className="pt-2">
              <Button type="submit">Criar Badge</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
