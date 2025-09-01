import { getQuizzes } from "@/actions/quizzes";
import QuizzesList from "./_components/quizzes-list";
import { AdminQuizListItem } from "./_components/types";

export default async function QuizzesPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    page?: string;
    moduleId?: string;
    courseId?: string;
  };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const search = searchParams.search || "";
  const moduleId = searchParams.moduleId || undefined; // undefined para não filtrar
  const courseId = searchParams.courseId || undefined; // undefined para não filtrar

  const quizzesResult = await getQuizzes({
    page,
    limit: 20,
    search,
    moduleId,
    courseId,
  });

  const rawQuizzes = quizzesResult.success
    ? quizzesResult.data?.quizzes || []
    : [];

  // Convert raw data to proper types
  const quizzes: AdminQuizListItem[] = rawQuizzes.map((quiz) => ({
    ...quiz,
    allowedQuestionTypes: Array.isArray(quiz.allowedQuestionTypes)
      ? (quiz.allowedQuestionTypes as string[])
      : ["MULTIPLE_CHOICE", "MULTIPLE_SELECT", "TRUE_FALSE"],
    module: {
      ...quiz.module,
      slug:
        quiz.module.slug ||
        quiz.module.title.toLowerCase().replace(/\s+/g, "-"),
    },
  }));

  const pagination =
    quizzesResult.success && quizzesResult.data?.pagination
      ? {
          page: quizzesResult.data.pagination.page,
          limit: quizzesResult.data.pagination.limit,
          total: quizzesResult.data.pagination.total,
          totalPages: quizzesResult.data.pagination.totalPages,
          hasNext: quizzesResult.data.pagination.hasNext,
          hasPrev: quizzesResult.data.pagination.hasPrev,
        }
      : null;

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Quizzes</h2>
      </div>

      <QuizzesList
        initialQuizzes={quizzes}
        initialPagination={pagination}
        searchParams={{
          search: searchParams.search || "",
          page: searchParams.page || "1",
          moduleId: searchParams.moduleId || "all",
          courseId: searchParams.courseId || "all",
        }}
      />
    </main>
  );
}
