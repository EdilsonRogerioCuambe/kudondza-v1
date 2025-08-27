// Tipos
export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  trailer?: string;
  courseMaterials?: string;
  categoryId: string;
  subcategoryId?: string;
  tags: string[];
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  language: string;
  duration?: number;
  price: number;
  originalPrice?: number;
  currency: string;
  isPublic: boolean;
  isPremium: boolean;
  allowDownload: boolean;
  hasPrerequisites: boolean;
  unlockCriteria?: UnlockCriteria;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  xpReward: number;
  badgeId?: string;
  instructorId?: string;
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED" | "SUSPENDED";
  seriesId?: string;
}

export type UnlockCriteria =
  | { type: "none" }
  | { type: "prerequisite"; courseIds: string[] }
  | { type: "xp"; minXp: number }
  | { type: "purchase"; required: boolean };

export interface CourseUpsertFormProps {
  mode: "create" | "edit";
  initialCourse?: Course | null;
  onSuccess: (course: Course) => void;
  onCancel: () => void;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  image?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  courseCount: number;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  courseCount: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category?: Category;
}

export interface CategoryUpsertFormProps {
  mode: "create" | "edit";
  initialCategory?: Category | null;
  onSuccess: (category: Category) => void;
  onCancel: () => void;
}

export interface SubcategoryUpsertFormProps {
  mode: "create" | "edit";
  initialSubcategory?: Subcategory | null;
  categoryId: string;
  onSuccess: (subcategory: Subcategory) => void;
  onCancel: () => void;
}
