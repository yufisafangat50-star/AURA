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
    const genome = await prisma.genome.findUnique({
      where: { user_id: user.id },
    });

    return NextResponse.json({ data: genome });
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
    
    const upsertData = {
      fields_of_interest: body.fields_of_interest || [],
      skills: body.skills || [],
      experience_level: "pemula" as const,
      data_access: body.data_access || [],
      constraints: body.constraints || "",
      research_style_notes: body.open_ended || "",
    };

    const genome = await prisma.genome.upsert({
      where: { user_id: user.id },
      create: {
        user_id: user.id,
        ...upsertData,
      },
      update: {
        ...upsertData,
      },
    });

    return NextResponse.json({ data: genome });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
