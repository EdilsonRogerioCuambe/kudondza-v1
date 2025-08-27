"use client";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Book, Swords, Pickaxe, Users } from "lucide-react";
import Link from "next/link";

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: FeatureProps[] = [
  {
    title: "Cursos Completos",
    description:
      "Aprenda com cursos dinâmicos e envolventes construídos por especialistas da indústria.",
    icon: <Book className="h-6 w-6" />,
  },
  {
    title: "Aprendizado Interativo",
    description:
      "Experimente uma abordagem prática com quizzes, exercícios e projetos.",
    icon: <Swords className="h-6 w-6" />,
  },
  {
    title: "Acompanhamento de Progresso",
    description:
      "Monitore seu progresso com painéis intuitivos e relatórios detalhados.",
    icon: <Pickaxe className="h-6 w-6" />,
  },
  {
    title: "Comunidade Ativa",
    description:
      "Participe de discussões, tire dúvidas e colabore com outros alunos.",
    icon: <Users className="h-6 w-6" />,
  },
];

export default function HomePage() {
  const { data: session } = authClient.useSession();

  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline">
            O futuro da Educação Online em Moçambique
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Eleve sua experiência de aprendizado.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Descubra novas formas de aprender com nossa plataforma inovadora,
            projetada para atender às suas necessidades educacionais.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/courses"
              className={buttonVariants({
                size: "lg",
              })}
            >
              Explorar Cursos
            </Link>
            <Link
              href={session ? "/dashboard" : "/auth/signin"}
              className={buttonVariants({
                size: "lg",
                variant: session ? "secondary" : "outline",
              })}
            >
              {session ? "Dashboard" : "Entrar"}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="mb-4 text-primary text-4xl">{feature.icon}</div>
              <CardTitle className="text-xl font-semibold mb-2">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
