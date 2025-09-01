import { getQuiz } from "@/actions/quizzes";
import { notFound } from "next/navigation";
import { QuizDetail, QuizDetailRaw } from "../../_components/types";
import { QuizEditForm } from "./_components/quiz-edit-form";

interface QuizEditPageProps {
  params: {
    quizId: string;
  };
}

export default async function QuizEditPage({ params }: QuizEditPageProps) {
  const quizResult = await getQuiz(params.quizId);

  if (!quizResult.success || !quizResult.data) {
    notFound();
  }

  const rawQuiz = quizResult.data as QuizDetailRaw;

  // Convert raw data to proper types
  const quiz: QuizDetail = {
    ...rawQuiz,
    allowedQuestionTypes: Array.isArray(rawQuiz.allowedQuestionTypes)
      ? (rawQuiz.allowedQuestionTypes as string[])
      : ["MULTIPLE_CHOICE", "MULTIPLE_SELECT", "TRUE_FALSE"],
    questions: rawQuiz.questions.map((q) => ({
      ...q,
      options: Array.isArray(q.options) ? (q.options as string[]) : [],
      correctAnswers: Array.isArray(q.correctAnswers)
        ? (q.correctAnswers as (string | number)[])
        : [],
    })),
  };

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Editar Quiz</h2>
          <p className="text-muted-foreground">
            {quiz.module.course.title} • {quiz.module.title}
          </p>
        </div>
      </div>

      <QuizEditForm quiz={quiz} />
    </main>
  );
}
