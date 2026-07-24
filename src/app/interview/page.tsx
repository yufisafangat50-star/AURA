

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

  const isDeltaMode = searchParams.get("mode") === "delta";
  const [showDeltaForm, setShowDeltaForm] = useState(false);

  const handleComplete = (data: InterviewFormData) => {
    saveInterview(data);

    const title =
      data.open_ended.slice(0, 60).trim() +
      (data.open_ended.length > 60 ? "..." : "") ||
      "Project baru";
    const project = addProject(title);

    router.push(`/project/${project.id}`);
  };

  const handleConfirmGenome = () => {
    const project = addProject("Project baru");
    router.push(`/project/${project.id}`);
  };

  const handleUpdateGenome = () => {
    setShowDeltaForm(true);
  };

  if (isDeltaMode && genome && !showDeltaForm) {
    return (
      <div className="py-8">
        <GenomeSummary
          genome={genome}
          onConfirm={handleConfirmGenome}
          onUpdate={handleUpdateGenome}
        />
      </div>
    );
  }

  if (isDeltaMode && genome && showDeltaForm) {
    return (
      <div className="py-8">
        <InterviewStepper
          onComplete={handleComplete}
          deltaMode
          initialData={{
            fields_of_interest: genome.fields_of_interest,
            skills: genome.skills,
            data_access: genome.data_access,
            constraints: genome.constraints,
            open_ended: "",
          }}
        />
      </div>
    );
  }

  return (
    <div className="py-8">
      <InterviewStepper onComplete={handleComplete} />
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
