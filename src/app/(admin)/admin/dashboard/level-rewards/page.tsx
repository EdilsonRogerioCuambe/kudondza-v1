import { getLevelRewards } from "@/actions/level-rewards/get-level-rewards";
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
import { Star } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const res = await getLevelRewards();
  const items = res.success ? res.data : [];

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Recompensas por Nível"
        description="Gerencie recompensas ao atingir níveis"
        actions={
          <Button asChild>
            <Link href="/admin/dashboard/level-rewards/create">
              Criar Recompensa
            </Link>
          </Button>
        }
      />

      {items.length === 0 ? (
        <Card className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="rounded-full border size-16 flex items-center justify-center text-muted-foreground">
              <Star className="size-7" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Nenhuma recompensa ainda
              </h3>
              <p className="text-sm text-muted-foreground">
                Crie a primeira recompensa para começar.
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/dashboard/level-rewards/create">
                Criar Recompensa
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nível</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>XP Bônus</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.level}</TableCell>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.value}</TableCell>
                  <TableCell>{r.xpReward}</TableCell>
                  <TableCell>{r.isActive ? "Ativa" : "Inativa"}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/admin/dashboard/level-rewards/${r.id}/edit`}
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
