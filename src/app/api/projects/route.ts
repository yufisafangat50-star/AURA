import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      where: { user_id: user.id },
      orderBy: { updated_at: "desc" },
    });

    return NextResponse.json({ data: projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        user_id: user.id,
        title,
        status: "active",
        canvas: {
          create: {
            problem: "",
            research_question: "",
            candidate_variables: "",
            research_gap_notes: "",
            candidate_methods: "",
            notes: "",
          }
        }
      },
      include: {
        canvas: true,
      }
    });

    return NextResponse.json({ data: project });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
