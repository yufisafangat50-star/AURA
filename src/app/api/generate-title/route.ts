import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { open_ended, fields_of_interest } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { title: open_ended?.slice(0, 50) || "Project Baru" }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const modelName = process.env.GEMINI_MODEL_NAME || "gemini-3.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
Anda adalah AI Research Assistant bernama Aura.
Tugas Anda adalah membuat SATU baris judul proyek riset yang sangat singkat (maksimal 3-6 kata), menarik, padat, dan profesional berdasarkan input berikut:

Bidang Minat: ${fields_of_interest?.join(", ") || "Umum"}
Catatan/Ide Riset: "${open_ended || "Belum ada catatan detail"}"

Format Output:
Hanya tuliskan judulnya saja, tanpa tanda kutip, tanpa penjelasan, dan tanpa nomor.

Contoh Output:
Analisis Stunting Berbasis Geospasial
    `.trim();

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim().replace(/^["']|["']$/g, "");

    return NextResponse.json({ title: responseText });
  } catch (error: any) {
    console.error("Error generating title:", error);
    return NextResponse.json(
      { error: "Gagal membuat judul AI" },
      { status: 500 }
    );
  }
}
