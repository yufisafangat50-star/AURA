

"use client";

import { useState } from "react";

interface ChipSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;

  allowCustom?: boolean;
  customPlaceholder?: string;
}

export default function ChipSelect({
  options,
  selected,
  onChange,
  allowCustom = false,
  customPlaceholder = "Ketik lainnya...",
}: ChipSelectProps) {
  const [customValue, setCustomValue] = useState("");

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customValue.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      setCustomValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`
                border-2 px-3 py-1.5 text-sm transition-colors
                ${
                  isSelected
                    ? "border-ink bg-ink text-sage font-medium"
                    : "border-border-soft bg-paper-card text-ink-soft hover:border-ink hover:text-ink"
                }
              `}
              style={{ borderRadius: "3px" }}
            >
              {option}
            </button>
          );
        })}

        {selected
          .filter((s) => !options.includes(s))
          .map((custom) => (
            <button
              key={custom}
              type="button"
              onClick={() => toggleOption(custom)}
              className="border-2 border-ink bg-ink px-3 py-1.5 text-sm font-medium text-sage
                         transition-colors"
              style={{ borderRadius: "3px" }}
            >
              {custom} ×
            </button>
          ))}
      </div>

      {allowCustom && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={customPlaceholder}
            className="flex-1 border-2 border-border-soft bg-paper-card px-3 py-1.5 text-sm
                       text-ink placeholder:text-muted-light
                       focus:border-sage focus:outline-none"
            style={{ borderRadius: "3px" }}
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="border-2 border-border-soft px-3 py-1.5 text-sm text-ink-soft
                       transition-colors hover:border-ink hover:text-ink"
            style={{ borderRadius: "3px" }}
          >
            Tambah
          </button>
        </div>
      )}
    </div>
  );
}
