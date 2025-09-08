import { getCategoriesWithCount } from "@/actions/communities/get-categories-with-count";
import { getFeaturedCommunities } from "@/actions/communities/get-communities";
import { getFeaturedCourses } from "@/actions/courses/get-featured-courses";
import { getPublicReviews } from "@/actions/reviews/get-public-reviews";
import { getUsers } from "@/actions/users";
import CourseCard from "@/components/course-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Book, Pickaxe, Swords, Tag, Users } from "lucide-react";
import { headers } from "next/headers";
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

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Data with graceful fallbacks (mocked) when DB is unavailable
  const [
    coursesApi,
    communitiesApi,
    categoriesApi,
    usersStudentsRes,
    publicReviews,
  ] = await Promise.all([
    getFeaturedCourses(8).catch(() => []),
    getFeaturedCommunities(6).catch(() => []),
    getCategoriesWithCount().catch(() => []),
    // Count users with role STUDENT
    getUsers({ role: "STUDENT", page: 1, limit: 1 }).catch(() => ({
      users: [],
      pagination: { total: 0 },
    })),
    getPublicReviews(6).catch(() => []),
  ]);
  const featuredCourses = (coursesApi || []) as Awaited<
    ReturnType<typeof getFeaturedCourses>
  >;

  const featuredCommunities = (communitiesApi || []) as Awaited<
    ReturnType<typeof getFeaturedCommunities>
  >;

  const topCategories = (categoriesApi || []) as Awaited<
    ReturnType<typeof getCategoriesWithCount>
  >;

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
              href={session ? "/admin/dashboard" : "/auth/signin"}
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

      {/* Featured Courses */}
      <section className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Cursos em destaque
          </h2>
          <Link
            href="/courses"
            className="text-sm text-primary hover:underline"
          >
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {featuredCourses.map((c) => (
            <CourseCard
              key={c.id}
              id={c.id}
              title={c.title}
              slug={c.slug}
              thumbnail={c.thumbnail}
              level={c.level}
              language={c.language}
              shortDescription={c.shortDescription}
              price={c.price}
              originalPrice={c.originalPrice}
              currency={c.currency}
              duration={c.duration}
              instructorName={c.instructorName}
              categoryName={c.categoryName}
              averageRating={c.averageRating}
              ratingsCount={c.ratingsCount}
              enrollmentsCount={c.enrollmentsCount}
              // Novos props para progresso
              isEnrolled={c.isEnrolled}
              enrollmentProgress={c.enrollmentProgress}
              enrollmentStatus={c.enrollmentStatus}
              completedAt={c.completedAt}
            />
          ))}
        </div>
      </section>

      {/* Featured Communities */}
      <section className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Comunidades em destaque
          </h2>
          <Link
            href="/communities"
            className="text-sm text-primary hover:underline"
          >
            Explorar comunidades
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCommunities.map((c) => (
            <Card key={c.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> {c.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="line-clamp-2 mb-3">
                  {c.shortDescription ?? c.description ?? ""}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5">
                    <Users className="h-3 w-3" /> {c.memberCount} membros
                  </span>
                  {c.category?.name ? (
                    <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5">
                      <Tag className="h-3 w-3" /> {c.category.name}
                    </span>
                  ) : null}
                </div>
                <Link
                  href={`/communities/${c.slug}`}
                  className="mt-3 inline-block text-primary hover:underline"
                >
                  Ver comunidade
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Categories */}
      <section className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Categorias populares
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {topCategories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={{ pathname: "/communities", query: { category: cat.id } }}
            >
              <div className="rounded-md border p-3 hover:shadow-sm transition-shadow text-sm flex items-center justify-between gap-2">
                <span className="truncate inline-flex items-center gap-2">
                  <Tag className="h-3 w-3 text-primary" /> {cat.name}
                </span>
                <span className="text-muted-foreground">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Escolha um curso", "Aprenda praticando", "Ganhe certificados"].map(
          (step, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{`${
                  idx + 1
                }. ${step}`}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {idx === 0 && "Explore trilhas e encontre o conteúdo ideal."}
                {idx === 1 &&
                  "Projetos, quizzes e desafios diários para fixar."}
                {idx === 2 && "Comprove seu conhecimento e compartilhe."}
              </CardContent>
            </Card>
          )
        )}
      </section>

      {/* Numbers */}
      <section className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            label: "Alunos",
            value: String((usersStudentsRes?.pagination?.total as number) || 0),
          },
          { label: "Cursos", value: String(featuredCourses.length || 0) },
          {
            label: "Comunidades",
            value: String(featuredCommunities.length || 0),
          },
          { label: "Categorias", value: String(topCategories.length || 0) },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {stat.label}
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Testimonials */}
      {publicReviews.length > 0 ? (
        <section className="mt-16 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Depoimentos
            </h2>
            <Link
              href="/reviews"
              className="text-sm text-primary hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publicReviews.map((r) => (
              <Card key={r.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {r.user?.name ?? "Usuário"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {typeof r.rating === "number" ? (
                    <div className="text-sm text-foreground">
                      Nota: {r.rating.toFixed(1)}
                    </div>
                  ) : null}
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {r.comment || r.title || "Sem comentário"}
                  </p>
                  {r.course ? (
                    <Link
                      href={`/courses/${r.course.slug}`}
                      className="text-xs text-primary hover:underline"
                    >
                      Ver curso: {r.course.title}
                    </Link>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {/* Call to Action */}
      <section className="mt-20">
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <div className="absolute -left-10 -top-10 size-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -right-10 -bottom-10 size-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <Badge variant="outline">Pronto para começar?</Badge>
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
                Junte-se à comunidade e acelere seu aprendizado hoje.
              </h3>
              <p className="mt-2 text-muted-foreground">
                Aprenda com cursos práticos, participe de comunidades e alcance
                suas metas com trilhas e desafios diários.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href={session ? "/dashboard" : "/auth/signin"}
                className={buttonVariants({ size: "lg" })}
              >
                {session ? "Ir para o Dashboard" : "Começar agora"}
              </Link>
              <Link
                href="/courses"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Explorar cursos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
