import { getBadgesList } from "@/actions/badges/get-badges-list";
import { Badge as UiBadge } from "@/components/ui/badge";
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
import { BadgeCheck, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const res = await getBadgesList();
  const badges = res.success ? res.data : [];

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Badges"
        description="Gerencie badges e critérios de conquista"
        actions={
          <Button asChild>
            <Link href="/admin/dashboard/badges/create">Criar Badge</Link>
          </Button>
        }
      />

      {badges.length === 0 ? (
        <Card className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="rounded-full border size-16 flex items-center justify-center text-muted-foreground">
              <Trophy className="size-7" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Nenhuma badge ainda</h3>
              <p className="text-sm text-muted-foreground">
                Crie a primeira badge para começar.
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/dashboard/gamification/badges/create">
                Criar Badge
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ícone</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Raridade</TableHead>
                <TableHead>XP</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {badges.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <div className="h-12 w-12 rounded-md border bg-muted/40 flex items-center justify-center overflow-hidden">
                      {typeof b.icon === "string" &&
                      b.icon.startsWith("http") ? (
                        <Image
                          src={b.icon}
                          alt={b.name}
                          width={40}
                          height={40}
                          className="object-cover rounded-md h-full w-full"
                        />
                      ) : (
                        <span className="text-lg">
                          {typeof b.icon === "string" && b.icon.length > 0
                            ? b.icon
                            : "🏅"}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell>
                    <UiBadge variant="secondary">{b.rarity}</UiBadge>
                  </TableCell>
                  <TableCell>{b.xpReward}</TableCell>
                  <TableCell>
                    <div
                      className="h-4 w-6 rounded border"
                      style={{ backgroundColor: b.color }}
                    />
                  </TableCell>
                  <TableCell>
                    {b.createdAt
                      ? new Date(
                          b.createdAt as unknown as string
                        ).toLocaleDateString("pt-PT")
                      : "—"}
                  </TableCell>
                  <TableCell className="flex items-center gap-1">
                    {b.isActive ? (
                      <>
                        <BadgeCheck className="h-4 w-4 text-green-600" />
                        <span>Ativa</span>
                      </>
                    ) : (
                      <span>Inativa</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/dashboard/badges/${b.id}/edit`}>
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

// duplicate leftover removed
