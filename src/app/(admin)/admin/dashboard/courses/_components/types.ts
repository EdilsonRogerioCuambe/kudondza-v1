export type CourseStatus =
  | "DRAFT"
  | "REVIEW"
  | "PUBLISHED"
  | "ARCHIVED"
  | "SUSPENDED";
export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

export interface AdminCourseListItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  status: CourseStatus;
  level: CourseLevel;
  language: string;
  price: number;
  originalPrice?: number;
  currency: string;
  isPublic: boolean;
  isPremium: boolean;
  isFeatured: boolean;
  duration?: number;
  tags: string[];
  category?: { id: string; name: string; slug: string };
  subcategory?: { id: string; name: string; slug: string };
  instructor?: { id: string; name: string; email: string; image?: string };
  _count?: { modules: number; enrollments: number; reviews: number };
  createdAt: string;
  updatedAt: string;
}

export interface AdminCourseSeriesItem {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  isSequential: boolean;
  _count: { courses: number };
}

export interface CoursesListFilters {
  search: string;
  status: "all" | CourseStatus;
  level: "all" | CourseLevel;
  isPublic: "all" | "true" | "false";
}
