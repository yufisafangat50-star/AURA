

import type { EvidenceReference } from "@/lib/types";

interface ReferenceCardProps {
  reference: EvidenceReference;
}

export default function ReferenceCard({ reference }: ReferenceCardProps) {
  return (
    <a
      href={reference.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-border-soft bg-paper px-3 py-2 transition-colors
                 hover:border-sage group"
      style={{ borderRadius: "2px" }}
    >
      <div className="flex items-start gap-2">

        <svg
          width="14"
          height="14"
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

        <div className="min-w-0">
          <p className="text-xs font-medium text-ink leading-snug line-clamp-2 group-hover:text-sage">
            {reference.source_title}
          </p>
          <span className="label-caps mt-1 block text-muted-light">
            {reference.source_provider}
          </span>
        </div>
      </div>
    </a>
  );
}
