

"use client";

import type { Message } from "@/lib/types";
import EvidenceCard from "@/components/chat/EvidenceCard";
import DatasetCard from "@/components/chat/DatasetCard";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`
          relative max-w-[90%] border-2 px-4 py-3
          ${
            isUser
              ? "border-border-soft bg-paper-card text-ink"
              : message.is_critic 
                ? "washi-tape border-ink bg-paper-card-alt text-ink pt-5 shadow-sm"
                : message.is_literature_agent
                  ? "washi-tape border-sage bg-paper-card-alt text-ink pt-5 shadow-sm"
                  : "washi-tape border-border-soft bg-paper-card-alt text-ink pt-5"
          }
        `}
        style={{ borderRadius: "3px" }}
      >

        <span
          className={`label-caps mb-1.5 block ${
            isUser 
              ? "text-muted-light" 
              : message.is_critic 
                ? "text-ink font-bold" 
                : message.is_literature_agent
                  ? "text-sage font-bold"
                  : "text-sage"
          }`}
        >
          {isUser ? "Kamu" : message.is_critic ? "Aura (Kritik)" : message.is_literature_agent ? "Aura (Literatur)" : "Aura"}
        </span>

        {!isUser ? (
          <div className="text-sm leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-ink" {...props} />,
                em: ({ node, ...props }) => <em className="italic" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                h1: ({ node, ...props }) => <h1 className="font-serif text-lg font-semibold mt-4 mb-2 text-ink" {...props} />,
                h2: ({ node, ...props }) => <h2 className="font-serif text-base font-semibold mt-4 mb-2 text-ink" {...props} />,
                h3: ({ node, ...props }) => <h3 className="font-serif text-sm font-semibold mt-3 mb-1 text-ink" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-2 border-sage pl-3 italic text-muted-light my-3" {...props} />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        )}

        {message.references && message.references.length > 0 && (
          <div className="mt-4 space-y-3 border-t-2 border-border-soft pt-4">
            <span className="label-caps block text-sage mb-2">Sumber Literatur:</span>
            {message.references.map((ref) => (
              <EvidenceCard key={ref.id} reference={ref} />
            ))}
          </div>
        )}

        {message.dataset_references && message.dataset_references.length > 0 && (
          <div className="mt-4 space-y-3 border-t-2 border-border-soft pt-4">
            <span className="label-caps block text-sage mb-2">Sumber Dataset:</span>
            {message.dataset_references.map((ref) => (
              <DatasetCard key={ref.id} reference={ref} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
