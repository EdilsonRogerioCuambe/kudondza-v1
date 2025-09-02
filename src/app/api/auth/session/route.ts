import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ user: null });
    }

    // Retornar apenas os dados necessários para o cliente
    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: "STUDENT", // Default role, você pode ajustar conforme necessário
        image: session.user.image,
      },
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
