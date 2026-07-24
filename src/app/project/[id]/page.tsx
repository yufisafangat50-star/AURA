

"use client";

import { use } from "react";
import { useApp } from "@/lib/context";
import ChatPanel from "@/components/chat/ChatPanel";
import CanvasPanel from "@/components/canvas/CanvasPanel";
import { useMockChat } from "@/hooks/useMockChat";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);
  const { projects, getCanvas } = useApp();
  const { messages, isLoading, sendMessage } = useMockChat(projectId);

  const project = projects.find((p) => p.id === projectId);
  const canvas = getCanvas(projectId);

  return (
    <div>

      <div className="mb-4">
        <h1 className="font-serif text-xl font-semibold text-ink">
          {project?.title ?? "Project"}
        </h1>
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
