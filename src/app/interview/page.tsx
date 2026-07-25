

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { useApp } from "@/lib/context";
import InterviewStepper from "@/components/interview/InterviewStepper";
import GenomeSummary from "@/components/interview/GenomeSummary";
import type { InterviewFormData } from "@/lib/types";

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { genome, saveInterview, addProject } = useApp();

  const isDeltaMode = searchParams.get("mode") === "delta" || !!genome;

  const [showNameModal, setShowNameModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  const handleComplete = async (data: InterviewFormData) => {
    await saveInterview(data);

    setIsGeneratingTitle(true);
    setShowNameModal(true);

    try {
      const res = await fetch("/api/generate-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          open_ended: data.open_ended,
          fields_of_interest: data.fields_of_interest,
        }),
      });
      const json = await res.json();
      if (json.title) {
        setProjectTitle(json.title);
      } else {
        setProjectTitle(data.open_ended.slice(0, 60).trim() || "Project Baru");
      }
    } catch (err) {
      console.error("Gagal generate judul", err);
      setProjectTitle(data.open_ended.slice(0, 60).trim() || "Project Baru");
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleConfirmGenome = async () => {
    setIsGeneratingTitle(true);
    setShowNameModal(true);
    
    if (!genome) {
      setProjectTitle("Project Baru");
      setIsGeneratingTitle(false);
      return;
    }

    try {
      const res = await fetch("/api/generate-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          open_ended: genome.research_style_notes,
          fields_of_interest: genome.fields_of_interest,
        }),
      });
      const json = await res.json();
      if (json.title) {
        setProjectTitle(json.title);
      } else {
        setProjectTitle(genome.research_style_notes?.slice(0, 60).trim() || "Project Baru");
      }
    } catch (err) {
      console.error("Gagal generate judul", err);
      setProjectTitle(genome.research_style_notes?.slice(0, 60).trim() || "Project Baru");
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleCreateProject = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const project = await addProject(projectTitle || "Project Tanpa Nama");
      router.push(`/project/${project.id}`);
    } catch (error) {
      console.error(error);
      setIsCreating(false);
    }
  };

  const renderNameModal = () => {
    if (!showNameModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/80 backdrop-blur-sm px-4">
        <div className="card-pin w-full max-w-md bg-paper-card border-2 border-ink p-6 rounded" style={{ transform: "rotate(-0.5deg)" }}>
          <h2 className="font-serif text-xl font-bold text-ink mb-2">Beri Nama Project Ini</h2>
          <p className="text-sm text-ink-soft mb-4">
            Masukkan judul singkat yang mendeskripsikan riset Anda.
          </p>
          <div className="relative mb-6">
            <input
              type="text"
              className={`w-full rounded border border-ink bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none ${isGeneratingTitle ? "opacity-50" : ""}`}
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Judul Project..."
              autoFocus
              disabled={isGeneratingTitle}
            />
            {isGeneratingTitle && (
              <div className="absolute right-0 -bottom-5 flex items-center gap-2">
                <span className="text-xs text-ink-soft animate-pulse italic">Menganalisis konteks riset...</span>
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowNameModal(false)}
              disabled={isCreating}
              className="px-5 py-2 text-sm font-medium text-ink-soft hover:text-ink disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleCreateProject}
              disabled={isCreating}
              className="border-2 border-ink bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-ink-soft disabled:opacity-50"
            >
              {isCreating ? "Membuat..." : "Mulai Riset"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isDeltaMode && genome) {
    return (
      <div className="py-8">
        <GenomeSummary
          genome={genome}
          onConfirm={handleConfirmGenome}
          onSave={handleComplete}
        />
        {renderNameModal()}
      </div>
    );
  }

  return (
    <div className="py-8">
      <InterviewStepper onComplete={handleComplete} />
      {renderNameModal()}
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <span className="text-sm text-muted-text">Memuat...</span>
        </div>
      }
    >
      <InterviewContent />
    </Suspense>
  );
}
