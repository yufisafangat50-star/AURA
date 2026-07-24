

"use client";

import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t-2 border-border-soft bg-paper-card p-3">
      <div className="flex gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ceritakan apa yang ada di pikiranmu..."
          rows={2}
          disabled={disabled}
          className="flex-1 border-2 border-border-soft bg-paper px-3 py-2 text-sm text-ink
                     placeholder:text-muted-light resize-none
                     focus:border-sage focus:outline-none disabled:opacity-50"
          style={{ borderRadius: "3px" }}
        />
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className={`self-end border-2 px-4 py-2 text-sm font-medium transition-colors
            ${
              value.trim() && !disabled
                ? "border-ink bg-ink text-sage hover:bg-ink-soft"
                : "border-border-soft bg-paper-card text-muted-light cursor-not-allowed"
            }`}
          style={{ borderRadius: "3px" }}
        >
          Kirim
        </button>
      </div>
    </form>
  );
}
