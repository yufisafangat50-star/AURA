

"use client";

import type { Canvas } from "@/lib/types";
import CanvasCard from "@/components/canvas/CanvasCard";

interface CanvasPanelProps {
  canvas: Canvas | null;
  projectId?: string;
}

const CANVAS_FIELDS: { key: keyof Canvas; label: string }[] = [
  { key: "problem", label: "Problem" },
  { key: "research_question", label: "Research Question" },
  { key: "candidate_variables", label: "Kandidat Variabel" },
  { key: "research_gap_notes", label: "Research Gap" },
  { key: "candidate_methods", label: "Kandidat Metode" },
  { key: "notes", label: "Catatan" },
];

export default function CanvasPanel({ canvas, projectId }: CanvasPanelProps) {
  const hasContent =
    canvas &&
    CANVAS_FIELDS.some((f) => {
      const val = canvas[f.key];
      return typeof val === "string" && val.trim().length > 0;
    });

  return (
    <div
      className="flex h-full flex-col border-2 border-border-soft bg-paper-card"
      style={{ borderRadius: "3px" }}
    >

      <div className="border-b-2 border-border-soft px-4 py-2.5 flex justify-between items-center">
        <span className="label-caps">Research Canvas</span>
        {projectId && (
          <a
            href={`/api/projects/${projectId}/export`}
            className="text-xs font-semibold text-sage hover:text-ink transition-colors border border-sage hover:border-ink px-2 py-1 rounded-sm flex items-center gap-1"
            title="Export ke Microsoft Word"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Proposal
          </a>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!hasContent ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center max-w-xs">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border-2 border-border-soft bg-paper"
                style={{ borderRadius: "3px", transform: "rotate(2deg)" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-sage"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <p className="text-sm text-muted-light leading-relaxed">
                Canvas akan terisi otomatis seiring diskusi kamu dengan Aura.
                Mulai ngobrol dulu di panel sebelah!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {CANVAS_FIELDS.map((field, index) => {
              const value = canvas?.[field.key];
              if (typeof value !== "string") return null;
              return (
                <CanvasCard
                  key={field.key}
                  label={field.label}
                  content={value}
                  updatedAt={canvas?.updated_at}
                  index={index}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
