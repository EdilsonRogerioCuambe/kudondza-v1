import { getDailyChallenges } from "@/actions/daily-challenges/get-daily-challenges";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const res = await getDailyChallenges();
  const items = res.success ? res.data : [];

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Desafios Diários"
        description="Gerencie desafios diários e recompensas"
        actions={
          <Button asChild>
            <Link href="/admin/dashboard/daily-challenges/create">
              Criar Desafio
            </Link>
          </Button>
        }
      />

      {items.length === 0 ? (
        <Card className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="rounded-full border size-16 flex items-center justify-center text-muted-foreground">
              <Clock className="size-7" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Nenhum desafio ainda</h3>
              <p className="text-sm text-muted-foreground">
                Crie o primeiro desafio para começar.
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/dashboard/daily-challenges/create">
                Criar Desafio
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Meta</TableHead>
                <TableHead>Recompensa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.title}</TableCell>
                  <TableCell>{d.type}</TableCell>
                  <TableCell>{d.target}</TableCell>
                  <TableCell>{d.reward} XP</TableCell>
                  <TableCell>{d.isActive ? "Ativo" : "Inativo"}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/admin/dashboard/daily-challenges/${d.id}/edit`}
                      >
                        Editar
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </main>
  );
}
