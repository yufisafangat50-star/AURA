"use client";

import { useState, useCallback, useEffect } from "react";
import type { Message } from "@/lib/types";
import { useApp } from "@/lib/context";

export function useChat(projectId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { updateCanvas } = useApp();

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/messages`);
      if (res.status === 404 || res.status === 401) {
        window.location.href = "/dashboard";
        return;
      }
      const data = await res.json();
      if (data.data) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMessages();

    fetch(`/api/projects/${projectId}`)
      .then(async (res) => {
        if (res.status === 404 || res.status === 401) {
          window.location.href = "/dashboard";
          return;
        }
        const data = await res.json();
        if (data.data?.canvas) {
          updateCanvas(projectId, data.data.canvas);
        }
      })
      .catch(err => console.error(err));
  }, [projectId, fetchMessages, updateCanvas]);

  const sendMessage = useCallback(
    async (content: string, isCritic: boolean = false, isLiteratureAgent: boolean = false) => {
      
      const optimisticMsg: Message = {
        id: `temp-${Date.now()}`,
        project_id: projectId,
        role: "user",
        content,
        is_critic: isCritic,
        is_literature_agent: isLiteratureAgent,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMsg]);
      setIsLoading(true);

      try {
        const res = await fetch(`/api/projects/${projectId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, isCritic, isLiteratureAgent }),
        });
        
        const data = await res.json();
        
        if (data.data) {

          await fetchMessages();

          fetch(`/api/projects/${projectId}`)
            .then(res => res.json())
            .then(projectData => {
              if (projectData.data?.canvas) {
                updateCanvas(projectId, projectData.data.canvas);
              }
            });
        } else if (data.error) {
          console.error("Error from AI:", data.error);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [projectId, fetchMessages, updateCanvas]
  );

  return { messages, isLoading, sendMessage };
}
