import type { UnlockCriteria } from "@/@types/types";
import { getCourse } from "@/actions/courses/get-course";
import { notFound } from "next/navigation";
import CourseDetailView from "./_components/course-detail-view";

interface CoursePageProps {
  params: {
    courseSlug: string;
  };
}

function toUnlockCriteria(value: unknown): UnlockCriteria | undefined {
  if (!value || typeof value !== "object") return undefined;
  const obj = value as Record<string, unknown>;
  const type = obj.type;
  if (type === "none") return { type: "none" };
  if (type === "prerequisite") {
    const raw = Array.isArray(obj.courseIds) ? obj.courseIds : [];
    return { type: "prerequisite", courseIds: raw.map((v) => String(v)) };
  }
  if (type === "xp") {
    const minXp = Number((obj as { minXp?: unknown }).minXp ?? 0);
    return { type: "xp", minXp: Number.isFinite(minXp) ? minXp : 0 };
  }
  if (type === "purchase") {
    const required = Boolean((obj as { required?: unknown }).required);
    return { type: "purchase", required };
  }
  return undefined;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = params;

  // Buscar dados do curso
  const courseResult = await getCourse(courseSlug);

  if (!courseResult.success || !courseResult.data) {
    notFound();
  }

  const rawCourse = courseResult.data;
  const createdAtIso =
    typeof rawCourse.createdAt === "string"
      ? rawCourse.createdAt
      : rawCourse.createdAt instanceof Date
      ? rawCourse.createdAt.toISOString()
      : new Date(rawCourse.createdAt as unknown as number).toISOString();
  const updatedAtIso =
    typeof rawCourse.updatedAt === "string"
      ? rawCourse.updatedAt
      : rawCourse.updatedAt instanceof Date
      ? rawCourse.updatedAt.toISOString()
      : new Date(rawCourse.updatedAt as unknown as number).toISOString();

  const course = {
    id: rawCourse.id,
    title: rawCourse.title,
    slug: rawCourse.slug,
    description: rawCourse.description ?? undefined,
    shortDescription: rawCourse.shortDescription ?? undefined,
    thumbnail: rawCourse.thumbnail ?? undefined,
    trailer: rawCourse.trailer ?? undefined,
    courseMaterials: rawCourse.courseMaterials ?? undefined,
    categoryId: rawCourse.categoryId,
    subcategoryId: rawCourse.subcategoryId ?? undefined,
    tags: Array.isArray(rawCourse.tags) ? rawCourse.tags : [],
    level: rawCourse.level,
    language: rawCourse.language,
    duration: rawCourse.duration ?? undefined,
    price: Number(rawCourse.price),
    originalPrice:
      rawCourse.originalPrice != null
        ? Number(rawCourse.originalPrice)
        : undefined,
    currency: rawCourse.currency,
    isPublic: rawCourse.isPublic,
    isPremium: rawCourse.isPremium,
    allowDownload: rawCourse.allowDownload,
    hasPrerequisites: rawCourse.hasPrerequisites,
    unlockCriteria: toUnlockCriteria(rawCourse.unlockCriteria),
    seoTitle: rawCourse.seoTitle ?? undefined,
    seoDescription: rawCourse.seoDescription ?? undefined,
    seoKeywords: rawCourse.seoKeywords ?? undefined,
    xpReward:
      typeof rawCourse.xpReward === "number"
        ? rawCourse.xpReward
        : Number(rawCourse.xpReward),
    badgeId: rawCourse.badgeId ?? undefined,
    instructorId: rawCourse.instructorId ?? undefined,
    status: rawCourse.status,
    seriesId: rawCourse.seriesId ?? undefined,
    category: rawCourse.category,
    subcategory: rawCourse.subcategory ?? undefined,
    instructor: rawCourse.instructor
      ? {
          ...rawCourse.instructor,
          image: rawCourse.instructor.image ?? undefined,
        }
      : undefined,
    _count: rawCourse._count,
    createdAt: createdAtIso,
    updatedAt: updatedAtIso,
  };

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <CourseDetailView course={course} />
    </main>
  );
}
