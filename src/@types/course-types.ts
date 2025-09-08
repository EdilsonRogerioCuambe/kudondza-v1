// Tipos baseados no schema do Prisma
export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  trailer?: string;
  courseMaterials?: string;

  // Metadados
  categoryId: string;
  subcategoryId?: string;
  tags: string[];
  level: string;
  language: string;
  duration?: number;

  // Preços
  price: number;
  originalPrice?: number;
  currency: string;
  isPublic: boolean;
  isPremium: boolean;
  allowDownload: boolean;

  // Configurações
  hasPrerequisites: boolean;
  status: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];

  // Relacionamentos
  instructorId: string;
  instructor?: User;
  _count?: {
    enrollments: number;
    modules: number;
    reviews: number;
  };
  relatedCourses?: CourseRelation[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  location?: string;
  website?: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  order: number;
  isRequired: boolean;
  isPublic: boolean;
  xpReward: number;
  createdAt: Date;
  updatedAt: Date;

  // Relacionamentos
  courseId: string;
  lessons?: Lesson[];

  // Propriedades adicionais para componentes
  isCompleted?: boolean;
  progress?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  order: number;
  slug?: string;

  // Conteúdo
  videoUrl?: string;
  videoDuration?: number;
  transcript?: string;

  // Configurações
  isPreview: boolean;
  isRequired: boolean;
  isPublic: boolean;
  xpReward: number;
  createdAt: Date;
  updatedAt: Date;

  // Relacionamentos
  moduleId: string;
  resources?: Resource[];

  // Propriedades adicionais para componentes
  isCompleted?: boolean;
  isCurrent?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;

  // Relacionamentos
  lessonId: string;
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  isPublic: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relacionamentos
  userId: string;
  user?: User;
  courseId: string;
  course?: Course;
}

export interface CourseRelation {
  id: string;
  type: string;
  strength: number;
  sourceCourseId: string;
  targetCourseId: string;
  targetCourse?: Course;
}

// Tipos flexíveis para dados do Prisma
export type PrismaCourse = Partial<Course> & {
  id: string;
  title: string;
  slug: string;
  [key: string]: unknown;
};

export type PrismaModule = Partial<Module> & {
  id: string;
  title: string;
  order: number;
  [key: string]: unknown;
};

export type PrismaReview = Partial<Review> & {
  id: string;
  rating: number;
  [key: string]: unknown;
};

// Tipos para componentes
export interface CoursePageClientProps {
  course: PrismaCourse;
  modules: PrismaModule[];
  courseReviews: PrismaReview[];
  totalLessons: number;
  previewLessons: number;
  averageRating: number;
  hasActiveSubscription?: boolean; // Added to check subscription status
  userProgress?: number; // Added to pass user progress
}

export interface ModernCurriculumProps {
  modules: Module[];
  courseSlug: string;
  isEnrolled?: boolean;
  onPreviewLesson?: (lesson: Lesson, module: Module) => void;
  className?: string;
}

export interface ModuleSummary {
  id: string;
  title: string;
  slug: string;
}

export interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson;
  course: Course;
  module: ModuleSummary;
}

// Interfaces para componentes de lição
export interface LessonViewerProps {
  lesson: Lesson;
  course: Course;
  module: Module;
}

export interface LessonNavigationProps {
  course: Course;
  modules: Module[];
  currentModule: Module;
  currentLesson: Lesson;
}

export interface LessonSidebarProps {
  course: Course;
  modules: Module[];
  currentModule: Module;
  currentLesson: Lesson;
  courseProgress: number;
}

export interface LessonActionsProps {
  lesson: Lesson;
  course: Course;
  module: Module;
}

export interface LessonResourcesProps {
  resources: Resource[];
  lesson: Lesson;
}
