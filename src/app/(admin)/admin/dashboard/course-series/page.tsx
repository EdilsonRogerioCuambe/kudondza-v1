import { getSeries } from "@/actions/course-series/get-series";
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
import { Book } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const res = await getSeries();
  const items = res.success ? res.data : [];

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Séries de Cursos"
        description="Agrupe cursos em séries sequenciais"
        actions={
          <Button asChild>
            <Link href="/admin/dashboard/course-series/create">
              Criar Série
            </Link>
          </Button>
        }
      />

      {items.length === 0 ? (
        <Card className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="rounded-full border size-16 flex items-center justify-center text-muted-foreground">
              <Book className="size-7" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Nenhuma série ainda</h3>
              <p className="text-sm text-muted-foreground">
                Crie a primeira série para começar.
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/dashboard/course-series/create">
                Criar Série
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Capa</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Sequencial</TableHead>
                <TableHead>Cursos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="h-12 w-20 rounded-md border bg-muted/40 overflow-hidden">
                      {s.thumbnail ? (
                        <Image
                          src={s.thumbnail}
                          alt={s.title}
                          width={80}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell>{s.category?.name ?? "—"}</TableCell>
                  <TableCell>{s.level}</TableCell>
                  <TableCell>{s.isSequential ? "Sim" : "Não"}</TableCell>
                  <TableCell>{s._count?.courses ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/admin/dashboard/course-series/${s.id}/edit`}
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
