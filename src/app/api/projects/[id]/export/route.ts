import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType 
} from "docx";

function checkField(value: string | null | undefined): string {
  if (!value || value.trim() === "") {
    return "Belum didiskusikan";
  }
  return value.trim();
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: projectId } = await params;
    
    // Validasi kepemilikan
    const project = await prisma.project.findFirst({
      where: { id: projectId, user_id: user.id },
      include: { 
        canvas: true,
        references: {
          orderBy: { retrieved_at: 'asc' }
        },
        dataset_references: {
          orderBy: { retrieved_at: 'asc' }
        }
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 });
    }

    const canvas = project.canvas;

    const sections = [];

    // Judul Utama
    sections.push(
      new Paragraph({
        text: project.title || "Project Tanpa Judul",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ text: "" }),
      new Paragraph({ text: "" })
    );

    // Latar Belakang (Problem)
    sections.push(
      new Paragraph({
        text: "1. Latar Belakang",
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        children: [
          new TextRun({ 
            text: canvas ? checkField(canvas.problem) : "Belum didiskusikan",
            italics: !canvas || !canvas.problem || canvas.problem.trim() === "",
            font: "Times New Roman",
            size: 24, // 12pt (half-points in docx)
          }),
        ],
      }),
      new Paragraph({ text: "" })
    );

    // Rumusan Masalah (Research Question)
    sections.push(
      new Paragraph({
        text: "2. Rumusan Masalah",
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        children: [
          new TextRun({ 
            text: canvas ? checkField(canvas.research_question) : "Belum didiskusikan",
            italics: !canvas || !canvas.research_question || canvas.research_question.trim() === "",
            font: "Times New Roman",
            size: 24,
          }),
        ],
      }),
      new Paragraph({ text: "" })
    );

    // Variabel Penelitian (Candidate Variables)
    sections.push(
      new Paragraph({
        text: "3. Variabel Penelitian",
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        children: [
          new TextRun({ 
            text: canvas ? checkField(canvas.candidate_variables) : "Belum didiskusikan",
            italics: !canvas || !canvas.candidate_variables || canvas.candidate_variables.trim() === "",
            font: "Times New Roman",
            size: 24,
          }),
        ],
      }),
      new Paragraph({ text: "" })
    );

    // Tinjauan Pustaka Awal (EvidenceReference)
    sections.push(
      new Paragraph({
        text: "4. Tinjauan Pustaka Awal",
        heading: HeadingLevel.HEADING_2,
      })
    );

    if (project.references && project.references.length > 0) {
      project.references.forEach((ref: any, idx: number) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `• `, bold: true, font: "Times New Roman", size: 24 }),
              new TextRun({ text: ref.source_title, bold: true, font: "Times New Roman", size: 24 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Penulis: `, italics: true, font: "Times New Roman", size: 24 }),
              new TextRun({ text: `${ref.source_authors || "Tidak diketahui"} (${ref.publication_year || "Tahun tidak diketahui"})`, font: "Times New Roman", size: 24 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Abstrak: `, italics: true, font: "Times New Roman", size: 24 }),
              new TextRun({ text: ref.abstract_snippet || "Tidak ada abstrak.", font: "Times New Roman", size: 24 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `URL: `, italics: true, font: "Times New Roman", size: 24 }),
              new TextRun({ text: ref.source_url || "-", font: "Times New Roman", size: 24 }),
            ],
          }),
          new Paragraph({ text: "" }) // spacing between items
        );
      });
    } else {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: "Belum didiskusikan",
              italics: true,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        }),
        new Paragraph({ text: "" })
      );
    }

    // Dataset Referensi Awal (DatasetReference)
    sections.push(
      new Paragraph({
        text: "5. Sumber Dataset Awal",
        heading: HeadingLevel.HEADING_2,
      })
    );

    if (project.dataset_references && project.dataset_references.length > 0) {
      project.dataset_references.forEach((ref: any) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `• `, bold: true, font: "Times New Roman", size: 24 }),
              new TextRun({ text: ref.dataset_title, bold: true, font: "Times New Roman", size: 24 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Deskripsi: `, italics: true, font: "Times New Roman", size: 24 }),
              new TextRun({ text: ref.dataset_subtitle || "Tidak ada deskripsi.", font: "Times New Roman", size: 24 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Sumber: `, italics: true, font: "Times New Roman", size: 24 }),
              new TextRun({ text: `${ref.source_provider} (Oleh: ${ref.creator || "Anonim"})`, font: "Times New Roman", size: 24 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `URL: `, italics: true, font: "Times New Roman", size: 24 }),
              new TextRun({ text: ref.source_url || "-", font: "Times New Roman", size: 24 }),
            ],
          }),
          new Paragraph({ text: "" })
        );
      });
    } else {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: "Belum didiskusikan",
              italics: true,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        }),
        new Paragraph({ text: "" })
      );
    }

    // Metode yang Dipertimbangkan (Candidate Methods)
    sections.push(
      new Paragraph({
        text: "6. Metode yang Dipertimbangkan",
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        children: [
          new TextRun({ 
            text: canvas ? checkField(canvas.candidate_methods) : "Belum didiskusikan",
            italics: !canvas || !canvas.candidate_methods || canvas.candidate_methods.trim() === "",
            font: "Times New Roman",
            size: 24,
          }),
        ],
      }),
      new Paragraph({ text: "" })
    );

    // Catatan Tambahan (Notes + Research Gap)
    sections.push(
      new Paragraph({
        text: "7. Catatan Tambahan & Research Gap",
        heading: HeadingLevel.HEADING_2,
      })
    );
    
    let combinedNotes = "";
    if (canvas) {
      const gap = canvas.research_gap_notes?.trim();
      const notes = canvas.notes?.trim();
      if (gap) combinedNotes += gap;
      if (gap && notes) combinedNotes += "\n\n";
      if (notes) combinedNotes += notes;
    }
    
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: checkField(combinedNotes),
            italics: combinedNotes.trim() === "",
            font: "Times New Roman",
            size: 24,
          }),
        ],
      })
    );

    // Create the document
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Times New Roman",
              size: 24, // half points
            }
          }
        },
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 32, // 16pt
              bold: true,
              font: "Times New Roman",
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120,
              },
            },
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 28, // 14pt
              bold: true,
              font: "Times New Roman",
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120,
              },
            },
          }
        ]
      },
      sections: [{
        properties: {},
        children: sections,
      }],
    });

    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="Proposal_Draft_${projectId}.docx"`,
      },
    });

  } catch (error: any) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
