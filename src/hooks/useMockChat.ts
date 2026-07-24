

"use client";

import { useState, useCallback } from "react";
import { useApp } from "@/lib/context";
import type { Message, EvidenceReference } from "@/lib/types";
import { MOCK_REFERENCES } from "@/data/mock";

const AI_RESPONSES: Array<{
  content: string;
  references?: EvidenceReference[];
  canvasUpdate?: Record<string, string>;
}> = [
  {
    content:
      "Menarik! 🔍 Coba ceritakan lebih detail — apa yang bikin topik ini penting menurut kamu? Ada pengalaman pribadi atau observasi yang memicu ketertarikan ini?",
  },
  {
    content:
      "Oke, jadi ada aspek personal di situ. Sekarang aku mau gali sedikit — menurut kamu, apa yang sudah diketahui orang tentang topik ini? Dan bagian mana yang masih belum jelas atau bikin kamu bertanya-tanya?",
    canvasUpdate: {
      problem: "Topik yang dipilih user menarik karena ada relevansi personal dan observasi langsung dari lingkungan sekitar.",
    },
  },
  {
    content:
      'Bagus, kamu sudah mulai lihat celahnya! Aku coba carikan beberapa studi yang relevan ya...',
    references: [MOCK_REFERENCES[0]],
    canvasUpdate: {
      research_gap_notes:
        "Ada gap antara apa yang sudah diteliti secara teori dengan kondisi aktual di lapangan yang diamati user.",
    },
  },
  {
    content:
      "Dari studi itu, ada beberapa variabel yang muncul berulang. Menurut kamu, mana yang paling bisa kamu ukur dengan data yang kamu punya?",
    references: [MOCK_REFERENCES[1]],
    canvasUpdate: {
      candidate_variables:
        "Variabel yang teridentifikasi dari diskusi: perlu dipersempit berdasarkan ketersediaan data dan kemampuan pengukuran.",
    },
  },
  {
    content:
      "Keren, kamu sudah mulai mengerucutkan! Untuk metode, dengan skill yang kamu punya dan jenis data ini, ada beberapa pendekatan yang realistis. Mau aku jelaskan perbandingannya?",
    canvasUpdate: {
      candidate_methods:
        "Metode yang cocok akan ditentukan setelah variabel final dipilih — perlu pertimbangan antara ketersediaan data, skill user, dan tipe analisis yang dibutuhkan.",
    },
  },
  {
    content:
      "Sip! Coba kita rangkum posisi kamu sekarang:\n\n• Masalah sudah teridentifikasi\n• Beberapa referensi awal sudah ada\n• Variabel masih perlu dipersempit\n• Metode ada beberapa opsi\n\nLangkah selanjutnya, mau fokus ke mana dulu — variabel atau metode?",
    references: [MOCK_REFERENCES[2]],
    canvasUpdate: {
      research_question:
        "Research question sedang terbentuk — masih perlu dipersempit setelah variabel dan metode final ditentukan.",
    },
  },
];

interface UseMockChatReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => void;
}

export function useMockChat(projectId: string): UseMockChatReturn {
  const { getMessages, addMessage, updateCanvas } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);

  const messages = getMessages(projectId);

  const sendMessage = useCallback(
    (content: string) => {

      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        project_id: projectId,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      };
      addMessage(projectId, userMessage);

      setIsLoading(true);
      const delay = 1000 + Math.random() * 1500; 

      setTimeout(() => {

        const response = AI_RESPONSES[responseIndex % AI_RESPONSES.length];

        const aiMessage: Message = {
          id: `msg-ai-${Date.now()}`,
          project_id: projectId,
          role: "assistant",
          content: response.content,
          created_at: new Date().toISOString(),
          references: response.references,
        };
        addMessage(projectId, aiMessage);

        if (response.canvasUpdate) {
          updateCanvas(projectId, response.canvasUpdate);
        }

        setResponseIndex((prev) => prev + 1);
        setIsLoading(false);
      }, delay);
    },
    [projectId, addMessage, updateCanvas, responseIndex]
  );

  return { messages, isLoading, sendMessage };
}
