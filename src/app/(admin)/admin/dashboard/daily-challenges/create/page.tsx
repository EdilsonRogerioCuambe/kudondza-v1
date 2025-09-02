import { createDailyChallenge } from "@/actions/daily-challenges/create-daily-challenge";
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
    const result = await createDailyChallenge(formData);
    if (result.success) {
      redirect("/admin/dashboard/daily-challenges");
    }
  }

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Criar Desafio Diário
          </h2>
          <p className="text-muted-foreground">
            Defina meta, tipo e recompensa do desafio.
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
                <Label htmlFor="type">Tipo</Label>
                <Select name="type" defaultValue="STUDY_TIME">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDY_TIME">Tempo de estudo</SelectItem>
                    <SelectItem value="EXERCISE_COMPLETION">
                      Exercícios
                    </SelectItem>
                    <SelectItem value="LOGIN_STREAK">Login contínuo</SelectItem>
                    <SelectItem value="COURSE_COMPLETION">Cursos</SelectItem>
                    <SelectItem value="LESSON_COMPLETION">Lições</SelectItem>
                    <SelectItem value="QUIZ_COMPLETION">Quizzes</SelectItem>
                    <SelectItem value="PROJECT_SUBMISSION">Projetos</SelectItem>
                    <SelectItem value="SOCIAL_INTERACTION">
                      Interações sociais
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">Meta</Label>
                <Input
                  id="target"
                  name="target"
                  type="number"
                  min={1}
                  defaultValue={1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reward">Recompensa (XP)</Label>
                <Input
                  id="reward"
                  name="reward"
                  type="number"
                  min={0}
                  defaultValue={50}
                />
              </div>
              <div className="space-y-2">
                <Label>Ativo</Label>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Recorrente</Label>
                <Select name="isRecurring" defaultValue="true">
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
                <Label htmlFor="expiresAt">Expira em</Label>
                <Input id="expiresAt" name="expiresAt" type="datetime-local" />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit">Criar Desafio</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
