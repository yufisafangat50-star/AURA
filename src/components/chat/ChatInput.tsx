

"use client";

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string, isCritic?: boolean, isLiteratureAgent?: boolean) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent, isCritic: boolean = false, isLiteratureAgent: boolean = false) => {
    e.preventDefault();
    if (isCritic) {
      if (!disabled) {
        onSend("Tolong kritik rancangan saya saat ini.", true, false);
      }
      return;
    }
    if (isLiteratureAgent) {
      if (!disabled) {
        onSend("Lakukan pencarian literatur mendalam untuk topik riset saya saat ini.", false, true);
      }
      return;
    }
    
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSend(trimmed, false, false);
      setValue("");
    }
  };

  const handleActionClick = (e: React.MouseEvent, isCritic: boolean, isLiteratureAgent: boolean) => {
    setIsMenuOpen(false);
    handleSubmit(e as unknown as React.FormEvent, isCritic, isLiteratureAgent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t-2 border-border-soft bg-paper-card px-3 py-2 flex flex-col gap-1">
      <form onSubmit={(e) => handleSubmit(e, false, false)} className="flex gap-2">
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
      </form>
      
      <div className="relative self-start" ref={menuRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="group text-xs text-muted-light hover:text-ink font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-block"
        >
          <span className="border-b border-muted-light group-hover:border-ink transition-colors pb-[1px]">
            Aksi lanjutan <span className="text-[10px] ml-0.5">{isMenuOpen ? "▲" : "▼"}</span>
          </span>
        </button>
        
        {isMenuOpen && (
          <div 
            className="absolute bottom-full left-0 mb-2 w-56 bg-paper border-2 border-border-soft shadow-sm z-10 flex flex-col overflow-hidden" 
            style={{ borderRadius: "3px" }}
          >
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => handleActionClick(e, true, false)}
              className="text-left text-xs text-ink hover:bg-paper-card-alt px-3 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b-2 border-border-soft"
            >
              Minta Aura mengkritik ide ini
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => handleActionClick(e, false, true)}
              className="text-left text-xs text-ink hover:bg-paper-card-alt px-3 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cari literatur lebih dalam
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
