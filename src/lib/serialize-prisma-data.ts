/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Função utilitária para serializar dados do Prisma
 * Converte objetos Decimal para números e garante que os dados sejam serializáveis
 */

// Tipo para objetos Decimal do Prisma
interface PrismaDecimal {
  toNumber(): number;
}

// Função para verificar se um objeto é um Decimal do Prisma
function isPrismaDecimal(obj: any): obj is PrismaDecimal {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.toNumber === "function" &&
    obj.constructor &&
    obj.constructor.name === "Decimal"
  );
}

export function serializePrismaData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle primitive types
  if (typeof data !== "object") {
    return data;
  }

  // Handle Date objects
  if (data instanceof Date) {
    return data.toISOString() as T;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializePrismaData(item)) as T;
  }

  // Verificar se é um objeto Decimal do Prisma
  if (isPrismaDecimal(data)) {
    return data.toNumber() as T;
  }

  // Handle objects with constructor functions or non-plain objects
  // Check if it's a plain object (created with {} or new Object())
  const isPlainObject =
    data.constructor === Object ||
    data.constructor === undefined ||
    Object.getPrototypeOf(data) === Object.prototype ||
    Object.getPrototypeOf(data) === null;

  // If it's not a plain object, try to convert it to a plain object
  if (!isPlainObject) {
    try {
      // Use JSON.parse(JSON.stringify()) to force serialization of complex objects
      return JSON.parse(JSON.stringify(data)) as T;
    } catch {
      // If JSON serialization fails, convert to string representation
      return String(data) as T;
    }
  }

  // Para objetos normais, serializar cada propriedade
  const serialized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    try {
      serialized[key] = serializePrismaData(value);
    } catch (error) {
      // If serialization of a property fails, skip it or use a default value
      console.warn(`Failed to serialize property "${key}":`, error);
      serialized[key] = null;
    }
  }
  return serialized as T;
}

/**
 * Serializa especificamente dados de curso do Prisma
 */
export function serializeCourseData(course: any) {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description ?? undefined,
    shortDescription: course.shortDescription ?? undefined,
    thumbnail: course.thumbnail ?? undefined,
    trailer: course.trailer ?? undefined,
    courseMaterials: course.courseMaterials ?? undefined,
    categoryId: course.categoryId,
    subcategoryId: course.subcategoryId ?? undefined,
    tags: Array.isArray(course.tags) ? course.tags : [],
    level: course.level,
    language: course.language,
    duration: course.duration ?? undefined,
    price: Number(course.price ?? 0),
    originalPrice:
      course.originalPrice != null ? Number(course.originalPrice) : undefined,
    currency: course.currency,
    isPublic: Boolean(course.isPublic),
    isPremium: Boolean(course.isPremium),
    allowDownload: Boolean(course.allowDownload),
    hasPrerequisites: Boolean(course.hasPrerequisites),
    unlockCriteria: course.unlockCriteria,
    seoTitle: course.seoTitle ?? undefined,
    seoDescription: course.seoDescription ?? undefined,
    seoKeywords: course.seoKeywords ?? undefined,
    xpReward: Number(course.xpReward ?? 0),
    badgeId: course.badgeId ?? undefined,
    instructorId: course.instructorId ?? undefined,
    status: course.status,
    seriesId: course.seriesId ?? undefined,
    category: course.category,
    subcategory: course.subcategory ?? undefined,
    instructor: course.instructor
      ? {
          ...course.instructor,
          image: course.instructor.image ?? undefined,
        }
      : undefined,
    _count: course._count,
    viewCount: Number(course.viewCount ?? 0),
    downloadCount: Number(course.downloadCount ?? 0),
    shareCount: Number(course.shareCount ?? 0),
    favoriteCount: Number(course.favoriteCount ?? 0),
    isFeatured: Boolean(course.isFeatured),
    featuredAt: course.featuredAt
      ? new Date(course.featuredAt).toISOString()
      : undefined,
    trendingScore: Number(course.trendingScore ?? 0),
    publishedAt: course.publishedAt
      ? new Date(course.publishedAt).toISOString()
      : undefined,
    createdAt: course.createdAt ? new Date(course.createdAt).toISOString() : "",
    updatedAt: course.updatedAt ? new Date(course.updatedAt).toISOString() : "",
    // Serializar dados aninhados
    prerequisites: course.prerequisites
      ? course.prerequisites.map((prereq: any) => ({
          ...prereq,
          prerequisite: prereq.prerequisite
            ? {
                ...prereq.prerequisite,
                price: Number(prereq.prerequisite.price ?? 0),
              }
            : undefined,
        }))
      : [],
    dependentCourses: course.dependentCourses
      ? course.dependentCourses.map((dep: any) => ({
          ...dep,
          course: dep.course
            ? {
                ...dep.course,
                price: Number(dep.course.price ?? 0),
              }
            : undefined,
        }))
      : [],
    relatedCourses: course.relatedCourses
      ? course.relatedCourses.map((rel: any) => ({
          ...rel,
          targetCourse: rel.targetCourse
            ? {
                ...rel.targetCourse,
                price: Number(rel.targetCourse.price ?? 0),
              }
            : undefined,
        }))
      : [],
    relatedTo: course.relatedTo
      ? course.relatedTo.map((rel: any) => ({
          ...rel,
          sourceCourse: rel.sourceCourse
            ? {
                ...rel.sourceCourse,
                price: Number(rel.sourceCourse.price ?? 0),
              }
            : undefined,
        }))
      : [],
    modules: course.modules || [],
    series: course.series,
  };
}

/**
 * Serializa especificamente dados de série de cursos do Prisma
 */
export function serializeCourseSeriesData(series: Record<string, unknown>) {
  return {
    id: series.id,
    title: series.title,
    description: series.description ?? undefined,
    thumbnail: series.thumbnail ?? undefined,
    isSequential: Boolean(series.isSequential),
    category: series.category,
    creator: series.creator,
    courses: series.courses
      ? (series.courses as Array<Record<string, unknown>>).map((course) => ({
          ...course,
          price: Number(course.price ?? 0),
        }))
      : [],
    _count: series._count,
    createdAt: series.createdAt
      ? new Date(series.createdAt as string).toISOString()
      : "",
    updatedAt: series.updatedAt
      ? new Date(series.updatedAt as string).toISOString()
      : "",
  };
}
