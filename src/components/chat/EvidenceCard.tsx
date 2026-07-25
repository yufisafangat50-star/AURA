

"use client";

import { useState } from "react";
import type { EvidenceReference } from "@/lib/types";

interface EvidenceCardProps {
  reference: EvidenceReference;
}

export default function EvidenceCard({ reference }: EvidenceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasLongAbstract = reference.abstract_snippet && reference.abstract_snippet.length > 120;

  return (
    <div
      className="block border-2 border-border-soft bg-paper-card px-4 py-3 mb-3 shadow-sm"
      style={{ borderRadius: "3px" }}
    >
      <div className="flex items-start gap-3">
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-ink leading-snug">
            {reference.source_title}
          </h4>
          <p className="text-xs text-muted-light mt-1">
            {reference.source_authors || "Penulis tidak diketahui"} {reference.publication_year ? `(${reference.publication_year})` : ""}
          </p>
          
          {reference.abstract_snippet && (
            <div className="mt-2">
              <p className={`text-xs text-ink/80 leading-relaxed italic border-l-2 border-sage/40 pl-2 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                "{reference.abstract_snippet}"
              </p>
              {hasLongAbstract && (
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
            Buka di {reference.source_provider || "Semantic Scholar"} ↗
          </a>
        </div>
      </div>
    </div>
  );
}
