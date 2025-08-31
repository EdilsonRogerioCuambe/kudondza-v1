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
}

export default function CourseDetails({
  course,
  series: _series, // Not used in this implementation but required by interface
}: CourseDetailsProps) {
  return <CourseDetailView course={course} />;
}
