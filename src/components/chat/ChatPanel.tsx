

"use client";

import { useRef, useEffect } from "react";
import type { Message } from "@/lib/types";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export default function ChatPanel({
  messages,
  onSendMessage,
  isLoading = false,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col border-2 border-border-soft bg-paper-card"
         style={{ borderRadius: "3px" }}>

      <div className="border-b-2 border-border-soft px-4 py-2.5">
        <span className="label-caps">Diskusi</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-light text-center max-w-xs">
              Belum ada pesan. Mulai dengan menceritakan masalah atau topik
              yang bikin kamu penasaran!
            </p>
          </div>
        ) : (
          messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)
        )}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div
              className="washi-tape border-2 border-border-soft bg-paper-card-alt px-4 py-3 pt-5"
              style={{ borderRadius: "3px" }}
            >
              <span className="label-caps text-sage mb-1.5 block">Aura</span>
              <div className="flex gap-1.5">
                <span className="inline-block h-2 w-2 bg-sage opacity-60 animate-pulse"
                      style={{ borderRadius: "1px", animationDelay: "0ms" }} />
                <span className="inline-block h-2 w-2 bg-sage opacity-60 animate-pulse"
                      style={{ borderRadius: "1px", animationDelay: "200ms" }} />
                <span className="inline-block h-2 w-2 bg-sage opacity-60 animate-pulse"
                      style={{ borderRadius: "1px", animationDelay: "400ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatInput onSend={onSendMessage} disabled={isLoading} />
    </div>
  );
}
