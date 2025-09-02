import { getLevelReward } from "@/actions/level-rewards/get-level-reward";
import { updateLevelReward } from "@/actions/level-rewards/update-level-reward";
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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getLevelReward(id);
  if (!res.success || !res.data) {
    return (
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader title="Recompensa não encontrada" />
      </main>
    );
  }
  const r = res.data;

  async function action(formData: FormData): Promise<void> {
    "use server";
    const result = await updateLevelReward(formData);
    if (result.success) {
      redirect("/admin/dashboard/level-rewards");
    }
  }

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Editar Recompensa de Nível" />
      <form action={action} className="max-w-3xl">
        <input type="hidden" name="id" value={r.id} />
        <Card>
          <CardHeader>
            <CardTitle>Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Nível</Label>
                <Input
                  id="level"
                  name="level"
                  type="number"
                  min={1}
                  defaultValue={r.level}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" defaultValue={r.title} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select name="type" defaultValue={r.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BADGE">Badge</SelectItem>
                    <SelectItem value="TITLE">Título</SelectItem>
                    <SelectItem value="XP_BONUS">XP Bônus</SelectItem>
                    <SelectItem value="FEATURE_UNLOCK">
                      Desbloqueio de feature
                    </SelectItem>
                    <SelectItem value="CUSTOM_AVATAR">Avatar custom</SelectItem>
                    <SelectItem value="CERTIFICATE">Certificado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={r.description ?? ""}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Valor</Label>
                <Input id="value" name="value" defaultValue={r.value} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xpReward">XP Bônus</Label>
                <Input
                  id="xpReward"
                  name="xpReward"
                  type="number"
                  min={0}
                  defaultValue={r.xpReward}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ativa</Label>
              <Select
                name="isActive"
                defaultValue={r.isActive ? "true" : "false"}
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

            <div className="pt-2">
              <Button type="submit">Salvar</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
