

"use client";

import type { Message } from "@/lib/types";
import ReferenceCard from "@/components/chat/ReferenceCard";

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`
          relative max-w-[75%] border-2 px-4 py-3
          ${
            isUser
              ? "border-border-soft bg-paper-card text-ink"
              : "washi-tape border-border-soft bg-paper-card-alt text-ink pt-5"
          }
        `}
        style={{ borderRadius: "3px" }}
      >

        <span
          className={`label-caps mb-1.5 block ${
            isUser ? "text-muted-light" : "text-sage"
          }`}
        >
          {isUser ? "Kamu" : "Aura"}
        </span>

        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>

        {message.references && message.references.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.references.map((ref) => (
              <ReferenceCard key={ref.id} reference={ref} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
