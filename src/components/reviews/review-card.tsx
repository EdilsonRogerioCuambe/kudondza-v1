"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDots,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconShieldCheck,
  IconStar,
  IconTrash,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    isPublic: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
    course: {
      id: string;
      title: string;
      slug: string;
      thumbnail: string | null;
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit?: (review: any) => void;
  onDelete?: (id: string) => void;
  onToggleVerification?: (id: string) => void;
  onTogglePublicity?: (id: string) => void;
  isAdmin?: boolean;
  isOwner?: boolean;
}

export function ReviewCard({
  review,
  onEdit,
  onDelete,
  onToggleVerification,
  onTogglePublicity,
  isAdmin = false,
  isOwner = false,
}: ReviewCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (onDelete) {
      setIsDeleting(true);
      try {
        await onDelete(review.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconStar
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={review.user.image || undefined}
                alt={review.user.name}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(review.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">
                  {review.user.name}
                </h4>
                {review.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    <IconShieldCheck className="h-3 w-3 mr-1" />
                    Verificado
                  </Badge>
                )}
                {!review.isPublic && (
                  <Badge variant="outline" className="text-xs">
                    <IconEyeOff className="h-3 w-3 mr-1" />
                    Privado
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Curso: {review.course.title}</span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(review.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            </div>
          </div>

          {(isAdmin || isOwner) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <IconDots className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(review)}>
                    <IconEdit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                )}
                {onTogglePublicity && (
                  <DropdownMenuItem
                    onClick={() => onTogglePublicity(review.id)}
                  >
                    {review.isPublic ? (
                      <>
                        <IconEyeOff className="h-4 w-4 mr-2" />
                        Tornar Privado
                      </>
                    ) : (
                      <>
                        <IconEye className="h-4 w-4 mr-2" />
                        Tornar Público
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                {isAdmin && onToggleVerification && (
                  <DropdownMenuItem
                    onClick={() => onToggleVerification(review.id)}
                  >
                    <IconShieldCheck className="h-4 w-4 mr-2" />
                    {review.isVerified ? "Desverificar" : "Verificar"}
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-destructive"
                  >
                    <IconTrash className="h-4 w-4 mr-2" />
                    {isDeleting ? "Deletando..." : "Deletar"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {renderStars(review.rating)}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {review.rating}/5
          </span>
        </div>

        {review.title && (
          <h5 className="font-medium text-sm mb-2">{review.title}</h5>
        )}

        {review.comment && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.comment}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
