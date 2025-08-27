import prisma from "@/lib/prisma";

/**
 * Busca cursos disponíveis para serem usados como pré-requisitos
 * Exclui o curso atual e cursos que já são pré-requisitos
 */
export async function getAvailableCoursesForPrerequisites(
  currentCourseId: string,
  excludeCourseIds: string[] = []
) {
  try {
    const courses = await prisma.course.findMany({
      where: {
        id: {
          not: currentCourseId,
          notIn: excludeCourseIds,
        },
        status: "PUBLISHED", // Apenas cursos publicados
      },
      select: {
        id: true,
        title: true,
        slug: true,
        level: true,
        description: true,
        thumbnail: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return courses;
  } catch (error) {
    console.error(
      "Erro ao buscar cursos disponíveis para pré-requisitos:",
      error
    );
    return [];
  }
}
