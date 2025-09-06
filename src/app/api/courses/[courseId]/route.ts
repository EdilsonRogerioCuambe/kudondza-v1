import { getCourse } from "@/actions/courses/get-course";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    console.log("API Route called with courseId:", courseId);

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID or slug is required" },
        { status: 400 }
      );
    }

    const result = await getCourse(courseId);

    console.log("getCourse result:", result);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error in courses API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
