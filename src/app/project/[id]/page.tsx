

"use client";

import { use, useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/context";
import ChatPanel from "@/components/chat/ChatPanel";
import CanvasPanel from "@/components/canvas/CanvasPanel";
import { useChat } from "@/hooks/useChat";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);
  const { projects, getCanvas } = useApp();
  const { messages, isLoading, sendMessage } = useChat(projectId);

  const project = projects.find((p) => p.id === projectId);
  const canvas = getCanvas(projectId);

  const { updateProject } = useApp();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleEditTitle = () => {
    if (!project) return;
    setTempTitle(project.title);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = async () => {
    if (!project || tempTitle.trim() === project.title) {
      setIsEditingTitle(false);
      return;
    }
    const newTitle = tempTitle.trim() || "Project";
    try {
      await updateProject(projectId, { title: newTitle });
    } catch (error) {
      console.error("Gagal menyimpan judul:", error);
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
    }
  };

  return (
    <div>

      <div className="mb-4">
        {isEditingTitle ? (
          <input
            ref={inputRef}
            type="text"
            className="font-serif text-xl font-semibold text-ink bg-transparent border-b border-ink focus:outline-none focus:ring-0 p-0 w-[60%]"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <h1 
            className="font-serif text-xl font-semibold text-ink cursor-pointer hover:text-ink-soft transition-colors flex items-center gap-2 group w-fit"
            onClick={handleEditTitle}
            title="Klik untuk mengubah judul"
          >
            {project?.title ?? "Project"}
            <span className="opacity-0 group-hover:opacity-100 text-sm">✎</span>
          </h1>
        )}
        <p className="text-xs text-muted-light mt-0.5">
          {project
            ? `Dibuat ${new Date(project.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`
            : ""}
        </p>
      </div>

      <div className="flex gap-4" style={{ height: "calc(100vh - 180px)" }}>

        <div className="w-[60%]">
          <ChatPanel
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>

        <div className="w-[40%]">
          <CanvasPanel canvas={canvas} />
        </div>
      </div>
    </div>
  );
}
