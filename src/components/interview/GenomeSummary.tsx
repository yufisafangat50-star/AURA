

"use client";

import type { Genome } from "@/lib/types";

interface GenomeSummaryProps {
  genome: Genome;
  onConfirm: () => void;
  onUpdate: () => void;
}

export default function GenomeSummary({
  genome,
  onConfirm,
  onUpdate,
}: GenomeSummaryProps) {
  return (
    <div className="mx-auto max-w-xl">
      <h2 className="font-serif text-xl font-semibold text-ink mb-2">
        Sebelum mulai, cek dulu profil riset kamu
      </h2>
      <p className="text-sm text-ink-soft mb-6">
        Ini yang kami tahu tentang kamu dari sesi sebelumnya. Masih relevan,
        atau ada yang berubah?
      </p>

      <div
        className="card-pin border-2 border-border-soft bg-paper-card p-6 pt-7 mb-6"
        style={{ borderRadius: "3px", transform: "rotate(-0.5deg)" }}
      >
        <div className="space-y-4">

          <div>
            <span className="label-caps">Bidang minat</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {genome.fields_of_interest.map((field) => (
                <span
                  key={field}
                  className="border border-border-soft bg-paper px-2 py-0.5 text-xs text-ink-soft"
                  style={{ borderRadius: "2px" }}
                >
                  {field}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="label-caps">Skills & tools</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {genome.skills.map((skill) => (
                <span
                  key={skill}
                  className="border border-border-soft bg-paper px-2 py-0.5 text-xs text-ink-soft"
                  style={{ borderRadius: "2px" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="label-caps">Akses data</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {genome.data_access.map((d) => (
                <span
                  key={d}
                  className="border border-border-soft bg-paper px-2 py-0.5 text-xs text-ink-soft"
                  style={{ borderRadius: "2px" }}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="label-caps">Keterbatasan</span>
            <p className="mt-1 text-sm text-ink-soft">{genome.constraints}</p>
          </div>

          {genome.research_style_notes && (
            <div>
              <span className="label-caps">Catatan gaya riset</span>
              <p className="mt-1 text-sm text-ink-soft">
                {genome.research_style_notes}
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-ink mb-4 font-medium">
        Masih relevan, atau ada yang baru?
      </p>

      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          className="border-2 border-ink bg-ink px-5 py-2 text-sm font-medium text-sage
                     transition-colors hover:bg-ink-soft"
          style={{ borderRadius: "3px" }}
        >
          Masih relevan, lanjut!
        </button>
        <button
          onClick={onUpdate}
          className="border-2 border-border-soft bg-paper-card px-5 py-2 text-sm font-medium
                     text-ink-soft transition-colors hover:border-ink hover:text-ink"
          style={{ borderRadius: "3px" }}
        >
          Ada yang berubah
        </button>
      </div>
    </div>
  );
}
