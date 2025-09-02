"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconStar } from "@tabler/icons-react";
import { useState } from "react";

interface ReviewFormProps {
  initialData?: {
    rating: number;
    title: string;
    comment: string;
  };
  onSubmit: (data: { rating: number; title: string; comment: string }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function ReviewForm({
  initialData = { rating: 0, title: "", comment: "" },
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Enviar Review",
}: ReviewFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating > 0) {
      onSubmit(formData);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= (hoveredRating || formData.rating);

      return (
        <button
          key={i}
          type="button"
          className={`p-1 transition-colors ${
            isFilled ? "text-yellow-400" : "text-gray-300"
          } hover:text-yellow-400`}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => handleRatingChange(starValue)}
          aria-label={`Avaliar com ${starValue} estrela${
            starValue > 1 ? "s" : ""
          }`}
        >
          <IconStar className={`h-8 w-8 ${isFilled ? "fill-current" : ""}`} />
        </button>
      );
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div className="space-y-3">
        <Label htmlFor="rating" className="text-base font-medium">
          Sua Avaliação *
        </Label>
        <div className="flex items-center gap-2">
          {renderStars()}
          <span className="ml-3 text-sm text-muted-foreground">
            {formData.rating > 0
              ? `${formData.rating}/5`
              : "Clique para avaliar"}
          </span>
        </div>
        {formData.rating === 0 && (
          <p className="text-sm text-destructive">
            Por favor, selecione uma avaliação
          </p>
        )}
      </div>

      {/* Título */}
      <div className="space-y-2">
        <Label htmlFor="title">Título (opcional)</Label>
        <Input
          id="title"
          placeholder="Resuma sua experiência em poucas palavras..."
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          maxLength={100}
        />
        <div className="text-xs text-muted-foreground text-right">
          {formData.title.length}/100
        </div>
      </div>

      {/* Comentário */}
      <div className="space-y-2">
        <Label htmlFor="comment">Comentário (opcional)</Label>
        <Textarea
          id="comment"
          placeholder="Compartilhe sua experiência detalhada com este curso..."
          value={formData.comment}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, comment: e.target.value }))
          }
          rows={4}
          maxLength={500}
        />
        <div className="text-xs text-muted-foreground text-right">
          {formData.comment.length}/500
        </div>
      </div>

      {/* Botões */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          disabled={formData.rating === 0 || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Enviando..." : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
