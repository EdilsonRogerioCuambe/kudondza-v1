"use client";

import type { Course as CourseType } from "@/@types/types";
import CourseDetailView from "./course-detail-view";

// Tipos
interface CourseSeries {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  isSequential: boolean;
  _count: { courses: number };
}

interface CourseDetailsProps {
  course: CourseType;
  series: CourseSeries[];
  modules?: Array<{
    id: string;
    title: string;
    slug: string | null;
    order: number;
    description?: string | null;
    isPublic: boolean;
    isRequired: boolean;
    lessons: Array<{
      id: string;
      title: string;
      slug: string | null;
      order: number;
      isPreview: boolean;
      isPublic: boolean;
    }>;
    _count?: { lessons: number };
  }>;
}

export default function CourseDetails({
  course,
  series: _series, // Not used in this implementation but required by interface
  modules,
}: CourseDetailsProps) {
  return <CourseDetailView course={course} modules={modules} />;
}
