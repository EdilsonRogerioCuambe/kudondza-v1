"use client";

import {
  createReview,
  deleteReview,
  getReviews,
  toggleReviewPublicity,
  toggleReviewVerification,
  updateReview,
} from "@/actions/reviews";
import { ReviewCard } from "@/components/reviews/review-card";
import { ReviewFilters } from "@/components/reviews/review-filters";
import { ReviewForm } from "@/components/reviews/review-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/hooks/use-auth";
import {
  IconEye,
  IconPlus,
  IconShieldCheck,
  IconStar,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Review {
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
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    rating: "all",
    isVerified: "all",
    isPublic: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const isAdmin = user?.role === "ADMIN";

  // Buscar reviews
  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(filters.search && { search: filters.search }),
        ...(filters.rating !== "all" &&
          filters.rating && { rating: parseInt(filters.rating) }),
        ...(filters.isVerified !== "all" && {
          isVerified: filters.isVerified === "true",
        }),
        ...(filters.isPublic !== "all" && {
          isPublic: filters.isPublic === "true",
        }),
        sortBy: filters.sortBy as "createdAt" | "rating" | "updatedAt",
        sortOrder: filters.sortOrder as "asc" | "desc",
      };

      const result = await getReviews(params);
      setReviews(result.reviews);
      setTotalResults(result.total);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Erro ao carregar as avaliações");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Criar review
  const handleCreateReview = async (data: {
    rating: number;
    title: string;
    comment: string;
  }) => {
    try {
      setIsCreating(true);
      // Por enquanto, vamos usar um courseId mockado
      // Em uma implementação real, você teria um seletor de curso
      const courseId = "mock-course-id";

      await createReview({
        ...data,
        courseId,
      });

      toast.success("Review criada com sucesso!");
      setShowCreateDialog(false);
      fetchReviews();
    } catch (error) {
      console.error("Error creating review:", error);
      toast.error("Erro ao criar review");
    } finally {
      setIsCreating(false);
    }
  };

  // Editar review
  const handleEditReview = async (data: {
    rating: number;
    title: string;
    comment: string;
  }) => {
    if (!editingReview) return;

    try {
      setIsEditing(true);
      await updateReview({
        id: editingReview.id,
        ...data,
      });

      toast.success("Review atualizada com sucesso!");
      setShowEditDialog(false);
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Erro ao atualizar review");
    } finally {
      setIsEditing(false);
    }
  };

  // Deletar review
  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview(id);
      toast.success("Review deletada com sucesso!");
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Erro ao deletar review");
    }
  };

  // Alternar verificação
  const handleToggleVerification = async (id: string) => {
    try {
      await toggleReviewVerification(id);
      toast.success("Status de verificação atualizado!");
      fetchReviews();
    } catch (error) {
      console.error("Error toggling verification:", error);
      toast.error("Erro ao atualizar verificação");
    }
  };

  // Alternar publicidade
  const handleTogglePublicity = async (id: string) => {
    try {
      await toggleReviewPublicity(id);
      toast.success("Visibilidade da review atualizada!");
      fetchReviews();
    } catch (error) {
      console.error("Error toggling publicity:", error);
      toast.error("Erro ao atualizar visibilidade");
    }
  };

  // Abrir modal de edição
  const openEditDialog = (review: Review) => {
    setEditingReview(review);
    setShowEditDialog(true);
  };

  // Filtros
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      rating: "all",
      isVerified: "all",
      isPublic: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setCurrentPage(1);
  };

  // Estatísticas
  const stats = {
    total: totalResults,
    verified: reviews.filter((r) => r.isVerified).length,
    public: reviews.filter((r) => r.isPublic).length,
    averageRating:
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : "0.0",
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Avaliações"
        description="Gerencie e visualize todas as avaliações dos cursos"
        actions={
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="h-4 w-4 mr-2" />
                Nova Avaliação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Nova Avaliação</DialogTitle>
                <DialogDescription>
                  Compartilhe sua experiência com um curso específico.
                </DialogDescription>
              </DialogHeader>
              <ReviewForm
                onSubmit={handleCreateReview}
                onCancel={() => setShowCreateDialog(false)}
                isSubmitting={isCreating}
                submitLabel="Criar Avaliação"
              />
            </DialogContent>
          </Dialog>
        }
      />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Avaliações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Avaliação Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <IconStar className="h-5 w-5 text-yellow-400 fill-current" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verificadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.verified}</div>
              <IconShieldCheck className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Públicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.public}</div>
              <IconEye className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar avaliações específicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReviewFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            totalResults={totalResults}
          />
        </CardContent>
      </Card>

      {/* Lista de Reviews */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              Carregando avaliações...
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-muted-foreground">
                Nenhuma avaliação encontrada com os filtros atuais.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onEdit={openEditDialog}
                onDelete={handleDeleteReview}
                onToggleVerification={
                  isAdmin ? handleToggleVerification : undefined
                }
                onTogglePublicity={handleTogglePublicity}
                isAdmin={isAdmin}
                isOwner={user?.id === review.user.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalResults > 10 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {Math.ceil(totalResults / 10)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(Math.ceil(totalResults / 10), prev + 1)
              )
            }
            disabled={currentPage >= Math.ceil(totalResults / 10)}
          >
            Próxima
          </Button>
        </div>
      )}

      {/* Modal de Edição */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Avaliação</DialogTitle>
            <DialogDescription>
              Atualize os detalhes da sua avaliação.
            </DialogDescription>
          </DialogHeader>
          {editingReview && (
            <ReviewForm
              initialData={{
                rating: editingReview.rating,
                title: editingReview.title || "",
                comment: editingReview.comment || "",
              }}
              onSubmit={handleEditReview}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingReview(null);
              }}
              isSubmitting={isEditing}
              submitLabel="Atualizar Avaliação"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
