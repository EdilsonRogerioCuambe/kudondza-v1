import { z } from "zod";

// ================================
// ENUMS
// ================================

export const CourseLevelSchema = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
]);
export const CourseStatusSchema = z.enum([
  "DRAFT",
  "REVIEW",
  "PUBLISHED",
  "ARCHIVED",
  "SUSPENDED",
]);

// ================================
// SCHEMAS BASE
// ================================

// Schema para criação de curso
export const CreateCourseSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  slug: z
    .string()
    .min(3, "Slug deve ter pelo menos 3 caracteres")
    .max(100, "Slug deve ter no máximo 100 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    ),
  description: z.string().optional(),
  shortDescription: z
    .string()
    .max(500, "Descrição curta deve ter no máximo 500 caracteres")
    .optional(),
  thumbnail: z.string().url().optional(),
  trailer: z.string().url().optional(),
  courseMaterials: z.string().url().optional(),

  // Metadados
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  subcategoryId: z.string().optional(),
  tags: z
    .array(z.string().min(1, "Tag não pode estar vazia"))
    .max(10, "Máximo 10 tags")
    .optional(),
  level: CourseLevelSchema,
  language: z.string().default("pt"),
  duration: z
    .number()
    .int()
    .positive("Duração deve ser um número positivo")
    .optional(),

  // Preços e configurações
  price: z.number().min(0, "Preço não pode ser negativo").default(0),
  originalPrice: z
    .number()
    .min(0, "Preço original não pode ser negativo")
    .optional(),
  currency: z.string().default("MZN"),
  isPublic: z.boolean().default(false),
  isPremium: z.boolean().default(false),
  allowDownload: z.boolean().default(false),

  // Configurações de acesso
  hasPrerequisites: z.boolean().default(false),
  seriesId: z.string().optional(),
  unlockCriteria: z.record(z.string(), z.any()).optional(),

  // SEO e marketing
  seoTitle: z
    .string()
    .max(60, "Título SEO deve ter no máximo 60 caracteres")
    .optional(),
  seoDescription: z
    .string()
    .max(160, "Descrição SEO deve ter no máximo 160 caracteres")
    .optional(),
  seoKeywords: z
    .array(z.string())
    .max(10, "Máximo 10 palavras-chave")
    .optional(),

  // Gamificação
  xpReward: z
    .number()
    .int()
    .min(0, "XP deve ser um número não negativo")
    .default(500),
  badgeId: z.string().optional(),
});

// Schema para atualização de curso
export const UpdateCourseSchema = CreateCourseSchema.partial().extend({
  id: z.string().min(1, "ID do curso é obrigatório"),
  status: CourseStatusSchema.optional(),
  publishedAt: z.date().optional(),
});

// Schema para busca/filtros de cursos
export const CourseFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  level: CourseLevelSchema.optional(),
  status: CourseStatusSchema.optional(),
  isPublic: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  instructorId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  language: z.string().optional(),
  isFeatured: z.boolean().optional(),
  sortBy: z
    .enum([
      "title",
      "createdAt",
      "updatedAt",
      "price",
      "viewCount",
      "trendingScore",
    ])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Schema para resposta de curso
export const CourseResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  shortDescription: z.string().nullable(),
  thumbnail: z.string().nullable(),
  trailer: z.string().nullable(),
  courseMaterials: z.string().nullable(),

  // Metadados
  categoryId: z.string(),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    })
    .optional(),
  subcategoryId: z.string().nullable(),
  subcategory: z
    .object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    })
    .nullable(),
  tags: z.array(z.string()),
  level: CourseLevelSchema,
  language: z.string(),
  duration: z.number().nullable(),

  // Preços e configurações
  price: z.number(),
  originalPrice: z.number().nullable(),
  currency: z.string(),
  isPublic: z.boolean(),
  isPremium: z.boolean(),
  allowDownload: z.boolean(),

  // Configurações de acesso
  hasPrerequisites: z.boolean(),
  seriesId: z.string().nullable(),
  unlockCriteria: z.record(z.string(), z.any()).nullable(),

  // Status e datas
  status: CourseStatusSchema,
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),

  // SEO e marketing
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  seoKeywords: z.array(z.string()),

  // Gamificação
  xpReward: z.number(),
  badgeId: z.string().nullable(),

  // Relacionamentos
  instructorId: z.string(),
  instructor: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      image: z.string().nullable(),
    })
    .optional(),

  // Estatísticas
  viewCount: z.number(),
  downloadCount: z.number(),
  shareCount: z.number(),
  favoriteCount: z.number(),
  isFeatured: z.boolean(),
  featuredAt: z.date().nullable(),
  trendingScore: z.number(),

  // Contadores relacionados
  _count: z
    .object({
      modules: z.number(),
      enrollments: z.number(),
      reviews: z.number(),
      certificates: z.number(),
    })
    .optional(),
});

// Schema para lista de cursos
export const CourseListResponseSchema = z.object({
  courses: z.array(CourseResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

// ================================
// SCHEMAS PARA PRÉ-REQUISITOS
// ================================

export const CreateCoursePrerequisiteSchema = z.object({
  courseId: z.string().min(1, "ID do curso é obrigatório"),
  prerequisiteId: z.string().min(1, "ID do pré-requisito é obrigatório"),
  isRequired: z.boolean().default(true),
  minimumProgress: z.number().int().min(0).max(100).default(100),
});

export const UpdateCoursePrerequisiteSchema =
  CreateCoursePrerequisiteSchema.partial().extend({
    id: z.string().min(1, "ID do pré-requisito é obrigatório"),
  });

export const CoursePrerequisiteResponseSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  prerequisiteId: z.string(),
  isRequired: z.boolean(),
  minimumProgress: z.number(),
  prerequisite: CourseResponseSchema.optional(),
});

// ================================
// SCHEMAS PARA SÉRIES DE CURSOS
// ================================

export const CreateCourseSeriesSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  description: z.string().optional(),
  thumbnail: z.string().url().optional(),
  isSequential: z.boolean().default(true),
  level: CourseLevelSchema,
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  creatorId: z.string().min(1, "Criador é obrigatório"),
});

export const UpdateCourseSeriesSchema =
  CreateCourseSeriesSchema.partial().extend({
    id: z.string().min(1, "ID da série é obrigatório"),
  });

export const CourseSeriesResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  thumbnail: z.string().nullable(),
  isSequential: z.boolean(),
  level: CourseLevelSchema,
  categoryId: z.string(),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    })
    .optional(),
  creatorId: z.string(),
  creator: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    })
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z
    .object({
      courses: z.number(),
    })
    .optional(),
});

// ================================
// SCHEMAS PARA RELACIONAMENTOS ENTRE CURSOS
// ================================

export const CourseRelationTypeSchema = z.enum([
  "PREREQUISITE",
  "RECOMMENDED",
  "SIMILAR",
  "COMPLEMENTARY",
  "ALTERNATIVE",
  "SEQUEL",
  "PART_OF_SERIES",
]);

export const CreateCourseRelationSchema = z.object({
  sourceCourseId: z.string().min(1, "ID do curso fonte é obrigatório"),
  targetCourseId: z.string().min(1, "ID do curso alvo é obrigatório"),
  type: CourseRelationTypeSchema,
  strength: z.number().int().min(1).max(10).default(5),
});

export const UpdateCourseRelationSchema =
  CreateCourseRelationSchema.partial().extend({
    id: z.string().min(1, "ID da relação é obrigatório"),
  });

export const CourseRelationResponseSchema = z.object({
  id: z.string(),
  type: CourseRelationTypeSchema,
  strength: z.number(),
  sourceCourseId: z.string(),
  targetCourseId: z.string(),
  sourceCourse: CourseResponseSchema.optional(),
  targetCourse: CourseResponseSchema.optional(),
});

// ================================
// SCHEMAS PARA FORMULÁRIOS
// ================================

// Schema para formulário de criação/edição de curso
export const CourseFormSchema = z.object({
  // Informações básicas
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  slug: z
    .string()
    .min(3, "Slug deve ter pelo menos 3 caracteres")
    .max(100, "Slug deve ter no máximo 100 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    ),
  description: z.string().optional(),
  shortDescription: z
    .string()
    .max(500, "Descrição curta deve ter no máximo 500 caracteres")
    .optional(),

  // Mídia
  thumbnail: z.string().url().optional(),
  trailer: z.string().url().optional(),
  courseMaterials: z.string().url().optional(),

  // Categorização
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  subcategoryId: z.string().optional(),
  tags: z
    .array(z.string().min(1, "Tag não pode estar vazia"))
    .max(10, "Máximo 10 tags")
    .optional(),
  level: CourseLevelSchema,
  language: z.string().default("pt"),
  duration: z
    .number()
    .int()
    .positive("Duração deve ser um número positivo")
    .optional(),

  // Preços
  price: z.number().min(0, "Preço não pode ser negativo").default(0),
  originalPrice: z
    .number()
    .min(0, "Preço original não pode ser negativo")
    .optional(),
  currency: z.string().default("MZN"),

  // Configurações
  isPublic: z.boolean().default(false),
  isPremium: z.boolean().default(false),
  allowDownload: z.boolean().default(false),
  hasPrerequisites: z.boolean().default(false),
  seriesId: z.string().optional(),

  // SEO
  seoTitle: z
    .string()
    .max(60, "Título SEO deve ter no máximo 60 caracteres")
    .optional(),
  seoDescription: z
    .string()
    .max(160, "Descrição SEO deve ter no máximo 160 caracteres")
    .optional(),
  seoKeywords: z
    .array(z.string())
    .max(10, "Máximo 10 palavras-chave")
    .optional(),

  // Gamificação
  xpReward: z
    .number()
    .int()
    .min(0, "XP deve ser um número não negativo")
    .default(500),
  badgeId: z.string().optional(),

  // Status
  status: CourseStatusSchema.default("DRAFT"),
});

// ================================
// SCHEMAS PARA MÓDULOS
// ================================

export const CreateModuleSchema = z.object({
  courseId: z.string().min(1, "ID do curso é obrigatório"),
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  slug: z
    .string()
    .min(3, "Slug deve ter pelo menos 3 caracteres")
    .max(100, "Slug deve ter no máximo 100 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    )
    .optional(),
  description: z.string().max(1000).optional(),
  isRequired: z.boolean().default(true),
  isPublic: z.boolean().default(false),
  xpReward: z.number().int().min(0).default(100),
});

export type CreateModuleInput = z.infer<typeof CreateModuleSchema>;

// Schema para upload de arquivos do curso
export const CourseFileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "Arquivo deve ter no máximo 10MB"
    ),
  type: z.enum(["thumbnail", "trailer", "materials"]),
  courseId: z.string().optional(), // Opcional para novos cursos
});

// Schema para validação de slug único
export const ValidateSlugSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  excludeId: z.string().optional(), // Para excluir o próprio curso na edição
});

// ================================
// SCHEMAS DE CATEGORIAS
// ================================

// Schema para criação de categoria
export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  slug: z
    .string()
    .min(3, "Slug deve ter pelo menos 3 caracteres")
    .max(100, "Slug deve ter no máximo 100 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    ),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
  seoTitle: z
    .string()
    .max(60, "Título SEO deve ter no máximo 60 caracteres")
    .optional(),
  seoDescription: z
    .string()
    .max(160, "Descrição SEO deve ter no máximo 160 caracteres")
    .optional(),
  seoKeywords: z
    .array(z.string())
    .max(10, "Máximo 10 palavras-chave")
    .optional(),
  parentId: z.string().optional(),
});

// Schema para atualização de categoria
export const UpdateCategorySchema = CreateCategorySchema.partial().extend({
  id: z.string(),
});

// Schema para criação de subcategoria
export const CreateSubcategorySchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  slug: z
    .string()
    .min(3, "Slug deve ter pelo menos 3 caracteres")
    .max(100, "Slug deve ter no máximo 100 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    ),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
});

// Schema para atualização de subcategoria
export const UpdateSubcategorySchema = CreateSubcategorySchema.partial().extend(
  {
    id: z.string(),
  }
);

// Schema para validação de slug único de categoria
export const ValidateCategorySlugSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  excludeId: z.string().optional(),
});

// Schema para validação de slug único de subcategoria
export const ValidateSubcategorySlugSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  excludeId: z.string().optional(),
});

// Schema para filtros de categoria
export const CategoryFiltersSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  parentId: z.string().optional(),
  sortBy: z
    .enum(["name", "createdAt", "courseCount", "sortOrder"])
    .default("sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Schema para resposta de categoria
export const CategoryResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    icon: z.string().nullable(),
    color: z.string().nullable(),
    image: z.string().nullable(),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
    sortOrder: z.number(),
    seoTitle: z.string().nullable(),
    seoDescription: z.string().nullable(),
    seoKeywords: z.array(z.string()),
    courseCount: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    parentId: z.string().nullable(),
    parent: z
      .object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
      })
      .nullable(),
    children: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
      })
    ),
    subcategories: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        courseCount: z.number(),
      })
    ),
  }),
  error: z.string().optional(),
});

// Schema para resposta de lista de categorias
export const CategoryListResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    categories: z.array(CategoryResponseSchema.shape.data),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
  error: z.string().optional(),
});

// Schema para resposta de subcategoria
export const SubcategoryResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    icon: z.string().nullable(),
    color: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number(),
    courseCount: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    categoryId: z.string(),
    category: z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    }),
  }),
  error: z.string().optional(),
});

// Schema para resposta de lista de subcategorias
export const SubcategoryListResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    subcategories: z.array(SubcategoryResponseSchema.shape.data),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
  error: z.string().optional(),
});

// ================================
// TIPOS TYPESCRIPT
// ================================

export type CourseLevel = z.infer<typeof CourseLevelSchema>;
export type CourseStatus = z.infer<typeof CourseStatusSchema>;
export type CourseRelationType = z.infer<typeof CourseRelationTypeSchema>;

export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;
export type CourseFilters = z.infer<typeof CourseFiltersSchema>;
export type CourseResponse = z.infer<typeof CourseResponseSchema>;
export type CourseListResponse = z.infer<typeof CourseListResponseSchema>;

export type CreateCoursePrerequisiteInput = z.infer<
  typeof CreateCoursePrerequisiteSchema
>;
export type UpdateCoursePrerequisiteInput = z.infer<
  typeof UpdateCoursePrerequisiteSchema
>;
export type CoursePrerequisiteResponse = z.infer<
  typeof CoursePrerequisiteResponseSchema
>;

export type CreateCourseSeriesInput = z.infer<typeof CreateCourseSeriesSchema>;
export type UpdateCourseSeriesInput = z.infer<typeof UpdateCourseSeriesSchema>;
export type CourseSeriesResponse = z.infer<typeof CourseSeriesResponseSchema>;

export type CreateCourseRelationInput = z.infer<
  typeof CreateCourseRelationSchema
>;
export type UpdateCourseRelationInput = z.infer<
  typeof UpdateCourseRelationSchema
>;
export type CourseRelationResponse = z.infer<
  typeof CourseRelationResponseSchema
>;

export type CourseFormData = z.infer<typeof CourseFormSchema>;
export type CourseFileUpload = z.infer<typeof CourseFileUploadSchema>;
export type ValidateSlugInput = z.infer<typeof ValidateSlugSchema>;

// Tipos para categorias
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type CategoryFilters = z.infer<typeof CategoryFiltersSchema>;
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;
export type CategoryListResponse = z.infer<typeof CategoryListResponseSchema>;

export type CreateSubcategoryInput = z.infer<typeof CreateSubcategorySchema>;
export type UpdateSubcategoryInput = z.infer<typeof UpdateSubcategorySchema>;
export type SubcategoryResponse = z.infer<typeof SubcategoryResponseSchema>;
export type SubcategoryListResponse = z.infer<
  typeof SubcategoryListResponseSchema
>;

export type ValidateCategorySlugInput = z.infer<
  typeof ValidateCategorySlugSchema
>;
export type ValidateSubcategorySlugInput = z.infer<
  typeof ValidateSubcategorySlugSchema
>;
