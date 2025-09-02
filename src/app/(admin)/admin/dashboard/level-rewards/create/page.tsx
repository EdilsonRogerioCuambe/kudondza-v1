import { createLevelReward } from "@/actions/level-rewards/create-level-reward";
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

export default async function Page() {
  async function action(formData: FormData): Promise<void> {
    "use server";
    const result = await createLevelReward(formData);
    if (result.success) {
      redirect("/admin/dashboard/level-rewards");
    }
  }

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Criar Recompensa de Nível
          </h2>
          <p className="text-muted-foreground">
            Defina nível, tipo e valor da recompensa.
          </p>
        </div>
      </div>

      <form action={action} className="max-w-3xl">
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
                  defaultValue={1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select name="type" defaultValue="XP_BONUS">
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
              <Textarea id="description" name="description" rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Valor</Label>
                <Input
                  id="value"
                  name="value"
                  placeholder="ex.: 1000, 'Super Dev', badgeId"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xpReward">XP Bônus</Label>
                <Input
                  id="xpReward"
                  name="xpReward"
                  type="number"
                  min={0}
                  defaultValue={0}
                />
              </div>
            </div>
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

            <div className="pt-2">
              <Button type="submit">Criar Recompensa</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
