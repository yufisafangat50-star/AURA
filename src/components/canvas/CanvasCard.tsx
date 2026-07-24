

"use client";

import { useState, useEffect } from "react";

interface CanvasCardProps {
  label: string;
  content: string;
  index: number;

  updatedAt?: string;
}

export default function CanvasCard({
  label,
  content,
  updatedAt,
}: CanvasCardProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (updatedAt) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [updatedAt]);

  if (!content) return null; 

  return (
    <div
      className={`card-pin border-2 bg-paper-card p-4 pt-5 ${
        isHighlighted ? "canvas-card-updated border-sage" : "border-border-soft"
      }`}
      style={{
        borderRadius: "3px",
        transition: "border-color 0.3s ease",
      }}
    >
      <span className="label-caps">{label}</span>
      <p className="mt-2 text-sm text-ink leading-relaxed whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
}
