export interface AdminQuizListItem {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  timeLimit?: number | null;
  passingScore: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  xpReward: number;
  allowedQuestionTypes: string[];
  createdAt: Date;
  updatedAt: Date;
  module: {
    id: string;
    title: string;
    slug: string;
    course: {
      id: string;
      title: string;
      slug: string;
      category: {
        id: string;
        name: string;
        slug: string;
      };
    };
  };
  _count: {
    questions: number;
    attempts: number;
  };
}

export interface QuizQuestion {
  id: string;
  title: string;
  type:
    | "MULTIPLE_CHOICE"
    | "MULTIPLE_SELECT"
    | "TRUE_FALSE"
    | "SHORT_ANSWER"
    | "ESSAY"
    | "CODE"
    | "ORDERING";
  explanation?: string | null;
  points: number;
  order: number;
  options: string[];
  correctAnswers: (string | number)[];
}

export interface QuizFilters {
  search: string;
  moduleId: string; // "all" para todos os módulos, ou ID específico
  courseId: string; // "all" para todos os cursos, ou ID específico
}

export interface QuizStats {
  totalQuizzes: number;
  totalQuestions: number;
  totalAttempts: number;
  averageScore: number;
}

export interface QuizDetail extends AdminQuizListItem {
  questions: QuizQuestion[];
}

// Type for raw Prisma data (before parsing)
export interface QuizQuestionRaw {
  id: string;
  title: string;
  type:
    | "MULTIPLE_CHOICE"
    | "MULTIPLE_SELECT"
    | "TRUE_FALSE"
    | "SHORT_ANSWER"
    | "ESSAY"
    | "CODE"
    | "ORDERING";
  explanation?: string | null;
  points: number;
  order: number;
  options: unknown; // JsonValue from Prisma
  correctAnswers: unknown; // JsonValue from Prisma
}

export interface QuizDetailRaw extends Omit<AdminQuizListItem, 'allowedQuestionTypes'> {
  allowedQuestionTypes: unknown; // JsonValue from Prisma
  questions: QuizQuestionRaw[];
}
