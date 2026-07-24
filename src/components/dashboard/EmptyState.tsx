

"use client";

interface EmptyStateProps {
  onCreateProject: () => void;
}

export default function EmptyState({ onCreateProject }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">

      <div
        className="mb-6 flex h-20 w-20 items-center justify-center border-2 border-border-soft bg-paper-card"
        style={{ borderRadius: "3px", transform: "rotate(-2deg)" }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-sage"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="8" y1="7" x2="16" y2="7" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>

      <h2 className="font-serif text-xl font-semibold text-ink mb-2">
        Belum ada project
      </h2>
      <p className="max-w-sm text-center text-sm text-ink-soft mb-8 leading-relaxed">
        Yuk mulai! Ceritakan apa yang bikin kamu penasaran, dan kita cari ide
        penelitian bareng.
      </p>

      <button
        onClick={onCreateProject}
        className="border-2 border-ink bg-ink px-6 py-2.5 text-sm font-medium text-sage
                   transition-colors hover:bg-ink-soft"
        style={{ borderRadius: "3px" }}
      >
        Mulai project baru
      </button>
    </div>
  );
}
