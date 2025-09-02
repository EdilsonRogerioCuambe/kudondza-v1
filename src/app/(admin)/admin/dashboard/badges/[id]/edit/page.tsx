import { getBadge } from "@/actions/badges/get-badge";
import { updateBadge } from "@/actions/gamification/update-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { redirect } from "next/navigation";
import CriteriaBuilder from "../../_components/criteria-builder";
import ImageUploadField from "../../_components/image-upload-field";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getBadge(id);
  if (!res.success || !res.data) {
    return (
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader title="Badge não encontrada" />
      </main>
    );
  }
  const b = res.data;

  async function action(formData: FormData): Promise<void> {
    "use server";
    const result = await updateBadge(formData);
    if (result.success) {
      redirect("/admin/dashboard/badges");
    }
  }

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Editar Badge" />
      <form action={action} className="max-w-3xl">
        <input type="hidden" name="id" value={b.id} />
        <Card>
          <CardHeader>
            <CardTitle>Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUploadField
              label="Imagem da badge"
              value={
                typeof b.icon === "string" && b.icon.startsWith("http")
                  ? b.icon
                  : undefined
              }
              targetInputId="icon"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" defaultValue={b.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Ícone</Label>
                <Input id="icon" name="icon" defaultValue={b.icon} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={b.description}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rarity">Raridade</Label>
                <Select name="rarity" defaultValue={b.rarity}>
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
                  defaultValue={b.xpReward}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Cor</Label>
                <Input id="color" name="color" defaultValue={b.color} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Ativa</Label>
                <Select
                  name="isActive"
                  defaultValue={b.isActive ? "true" : "false"}
                >
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
                <Select
                  name="isLimited"
                  defaultValue={b.isLimited ? "true" : "false"}
                >
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
                <Input
                  id="expiresAt"
                  name="expiresAt"
                  type="datetime-local"
                  defaultValue={
                    b.expiresAt
                      ? new Date(b.expiresAt).toISOString().slice(0, 16)
                      : ""
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Critérios</Label>
              <CriteriaBuilder
                inputName="criteria"
                initialCriteria={b.criteria}
              />
            </div>

            <div className="pt-2">
              <Button type="submit">Salvar alterações</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
