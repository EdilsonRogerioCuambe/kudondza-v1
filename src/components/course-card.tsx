"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Globe, Layers, Pickaxe, Play, Tag, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type CourseCardProps = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  level: string;
  language: string;
  shortDescription?: string | null;
  price: number;
  originalPrice?: number | null;
  currency: string;
  duration?: number | null;
  instructorName?: string | null;
  categoryName?: string | null;
  averageRating?: number | null;
  ratingsCount?: number;
  enrollmentsCount?: number;
  href?: string;
  // Novos props para progresso
  isEnrolled?: boolean;
  enrollmentProgress?: number;
  enrollmentStatus?: string;
  completedAt?: Date | null;
};

export default function CourseCard(props: CourseCardProps) {
  const href = props.href ?? `/courses/${props.slug}`;

  return (
    <Card className="group overflow-hidden h-full flex flex-col pt-0">
      <CardHeader className="p-0">
        {props.thumbnail ? (
          <div className="relative h-64 w-full">
            <Image
              src={props.thumbnail}
              alt={props.title}
              fill
              className="object-cover"
            />
          </div>
        ) : null}
        <CardTitle className="line-clamp-2 text-base px-6">
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2 flex flex-col h-full">
        {props.instructorName || props.categoryName ? (
          <div className="text-xs space-y-1">
            <div className="truncate">
              {props.instructorName ?? "Instrutor"}
            </div>
            {props.categoryName ? (
              <div className="inline-flex items-center gap-1 text-muted-foreground">
                <Tag className="h-3 w-3" /> {props.categoryName}
              </div>
            ) : null}
          </div>
        ) : null}

        {props.shortDescription ? (
          <p className="line-clamp-2">{props.shortDescription}</p>
        ) : null}

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5">
            <Layers className="h-3 w-3" /> {props.level}
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5">
            <Globe className="h-3 w-3" /> {props.language}
          </span>
          {typeof props.duration === "number" && props.duration > 0 ? (
            <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5">
              <Pickaxe className="h-3 w-3" /> {props.duration} min
            </span>
          ) : null}
        </div>

        {typeof props.averageRating === "number" ? (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-medium">
                {props.averageRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({props.ratingsCount ?? 0})
              </span>
            </div>
            {typeof props.enrollmentsCount === "number" && (
              <span className="text-muted-foreground inline-flex items-center gap-1">
                <Users className="h-3 w-3" /> {props.enrollmentsCount}
              </span>
            )}
          </div>
        ) : null}

        <div className="mt-auto" />

        {/* Barra de progresso para cursos matriculados */}
        {props.isEnrolled && typeof props.enrollmentProgress === "number" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">
                {Math.round(props.enrollmentProgress)}%
              </span>
            </div>
            <Progress value={props.enrollmentProgress} className="h-2" />
          </div>
        )}

        {/* Preço ou status do curso */}
        <div className="pt-1 flex items-baseline gap-2 text-foreground">
          {props.isEnrolled ? (
            <span className="text-green-600 font-semibold">
              {props.completedAt ? "Concluído" : "Matriculado"}
            </span>
          ) : props.price === 0 ? (
            <span className="text-green-600 font-semibold">Gratuito</span>
          ) : (
            <>
              <span className="text-lg font-semibold">
                {props.currency} {Number(props.price).toFixed(2)}
              </span>
              {props.originalPrice &&
              Number(props.originalPrice) > Number(props.price) ? (
                <span className="text-xs text-muted-foreground line-through">
                  {props.currency} {Number(props.originalPrice).toFixed(2)}
                </span>
              ) : null}
            </>
          )}
        </div>

        {/* Botão de ação */}
        {props.isEnrolled ? (
          <Button asChild className="mt-2 w-full">
            <Link href={`/courses/${props.slug}/learn`}>
              <Play className="h-4 w-4 mr-2" />
              {props.completedAt ? "Revisar curso" : "Continuar aprendendo"}
            </Link>
          </Button>
        ) : (
          <Link
            href={href}
            className="mt-2 inline-block text-primary hover:underline"
          >
            Ver curso
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
