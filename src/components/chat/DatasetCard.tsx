"use client";

import { useState } from "react";
import type { DatasetReference } from "@/lib/types";

interface DatasetCardProps {
  reference: DatasetReference;
}

export default function DatasetCard({ reference }: DatasetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasLongSubtitle = reference.dataset_subtitle && reference.dataset_subtitle.length > 120;

  return (
    <div
      className="block border-2 border-dashed border-sage/40 bg-paper-card px-4 py-3 mb-3 shadow-sm transition-colors hover:border-sage/60"
      style={{ borderRadius: "3px" }}
    >
      <div className="flex items-start gap-3">
        {/* Table/Grid Icon in sage */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 shrink-0 text-sage"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
          <line x1="9" y1="9" x2="9" y2="21"></line>
          <line x1="15" y1="9" x2="15" y2="21"></line>
        </svg>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-wider text-sage bg-sage/10 px-1.5 py-0.5 rounded-sm uppercase border border-sage/20">
              Sumber Dataset
            </span>
          </div>

          <h4 className="text-sm font-semibold text-ink leading-snug">
            {reference.dataset_title}
          </h4>
          
          <div className="text-xs text-muted-light mt-1 flex flex-col gap-0.5">
            <p>Dibuat oleh: {reference.creator || "Kreator tidak diketahui"}</p>
            {reference.coverage_period && (
              <p>Update: {reference.coverage_period}</p>
            )}
            {reference.license && (
              <p>Lisensi: {reference.license}</p>
            )}
          </div>
          
          {reference.dataset_subtitle && (
            <div className="mt-2">
              <p className={`text-xs text-ink/80 leading-relaxed italic border-l-2 border-sage/40 pl-2 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                "{reference.dataset_subtitle}"
              </p>
              {hasLongSubtitle && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[11px] font-medium text-sage hover:text-ink mt-1 transition-colors"
                >
                  {isExpanded ? "Tampilkan lebih sedikit" : "...selengkapnya"}
                </button>
              )}
            </div>
          )}

          <a 
            href={reference.source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs font-medium text-sage hover:text-ink underline decoration-sage/40 hover:decoration-ink underline-offset-4 transition-colors"
          >
            Buka di {reference.source_provider || "Kaggle"} ↗
          </a>
        </div>
      </div>
    </div>
  );
}
