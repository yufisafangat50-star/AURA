

"use client";

import { useState } from "react";
import ChipSelect from "@/components/interview/ChipSelect";
import { FIELD_OPTIONS, SKILL_OPTIONS, DATA_ACCESS_OPTIONS } from "@/data/mock";
import type { InterviewFormData } from "@/lib/types";

interface InterviewStepperProps {
  onComplete: (data: InterviewFormData) => void;

  deltaMode?: boolean;

  initialData?: Partial<InterviewFormData>;
}

const STEPS = [
  {
    key: "fields",
    title: "Bidang apa yang bikin kamu penasaran?",
    description:
      "Pilih yang menarik — boleh lebih dari satu. Nanti kita kerucutkan bareng.",
  },
  {
    key: "skills",
    title: "Tools dan skill apa yang kamu kuasai?",
    description:
      "Ini bantu kami carikan metode yang realistis buat kamu.",
  },
  {
    key: "experience",
    title: "Ceritakan pengalaman riset kamu",
    description:
      "Pernah bantu riset dosen? Magang di lab? Kerja di instansi? Ceritakan singkat aja.",
  },
  {
    key: "data_access",
    title: "Data apa yang bisa kamu akses?",
    description:
      "Sumber data yang sudah di tangan itu emas. Belum punya juga nggak apa-apa — kita cari jalan.",
  },
  {
    key: "constraints",
    title: "Ada batasan yang perlu kami tahu?",
    description:
      "Waktu, biaya, akses lokasi — supaya ide yang muncul realistis, bukan cuma keren di atas kertas.",
  },
  {
    key: "open_ended",
    title: "Terakhir — ceritakan masalah yang menurutmu penting untuk diteliti",
    description:
      "Bebas, tulis apa adanya. Ini yang akan jadi titik awal diskusi kita nanti.",
  },
] as const;

export default function InterviewStepper({
  onComplete,
  deltaMode = false,
  initialData,
}: InterviewStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<InterviewFormData>({
    fields_of_interest: initialData?.fields_of_interest ?? [],
    skills: initialData?.skills ?? [],
    experience_description: initialData?.experience_description ?? "",
    data_access: initialData?.data_access ?? [],
    constraints: initialData?.constraints ?? "",
    open_ended: initialData?.open_ended ?? "",
  });

  const totalSteps = STEPS.length;
  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0:
        return formData.fields_of_interest.length > 0;
      case 1:
        return formData.skills.length > 0;
      case 2:
        return formData.experience_description.trim().length > 0;
      case 3:
        return formData.data_access.length > 0;
      case 4:
        return formData.constraints.trim().length > 0;
      case 5:
        return formData.open_ended.trim().length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="mx-auto max-w-xl">

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="label-caps">
            Langkah {currentStep + 1}/{totalSteps}
          </span>
          {deltaMode && (
            <span className="text-xs text-sage font-medium">Mode update</span>
          )}
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="font-serif text-xl font-semibold text-ink mb-2">
        {step.title}
      </h2>
      <p className="text-sm text-ink-soft mb-6">{step.description}</p>

      <div className="mb-8">
        {currentStep === 0 && (
          <ChipSelect
            options={FIELD_OPTIONS}
            selected={formData.fields_of_interest}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, fields_of_interest: selected }))
            }
            allowCustom
            customPlaceholder="Bidang lain yang diminati..."
          />
        )}

        {currentStep === 1 && (
          <ChipSelect
            options={SKILL_OPTIONS}
            selected={formData.skills}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, skills: selected }))
            }
            allowCustom
            customPlaceholder="Tool/software lain..."
          />
        )}

        {currentStep === 2 && (
          <textarea
            value={formData.experience_description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                experience_description: e.target.value,
              }))
            }
            placeholder="Contoh: Pernah jadi asisten riset dosen selama 1 semester, mengolah data survei dengan SPSS..."
            rows={4}
            className="w-full border-2 border-border-soft bg-paper-card px-4 py-3 text-sm
                       text-ink placeholder:text-muted-light
                       focus:border-sage focus:outline-none resize-none"
            style={{ borderRadius: "3px" }}
          />
        )}

        {currentStep === 3 && (
          <ChipSelect
            options={DATA_ACCESS_OPTIONS}
            selected={formData.data_access}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, data_access: selected }))
            }
            allowCustom
            customPlaceholder="Sumber data lain..."
          />
        )}

        {currentStep === 4 && (
          <textarea
            value={formData.constraints}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, constraints: e.target.value }))
            }
            placeholder="Contoh: Waktu 3 bulan, budget terbatas, tidak bisa survei lapangan..."
            rows={3}
            className="w-full border-2 border-border-soft bg-paper-card px-4 py-3 text-sm
                       text-ink placeholder:text-muted-light
                       focus:border-sage focus:outline-none resize-none"
            style={{ borderRadius: "3px" }}
          />
        )}

        {currentStep === 5 && (
          <textarea
            value={formData.open_ended}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, open_ended: e.target.value }))
            }
            placeholder="Contoh: Aku penasaran kenapa kasus stunting di desa masih tinggi padahal program pemerintah sudah banyak..."
            rows={5}
            className="w-full border-2 border-border-soft bg-paper-card px-4 py-3 text-sm
                       text-ink placeholder:text-muted-light
                       focus:border-sage focus:outline-none resize-none"
            style={{ borderRadius: "3px" }}
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`border-2 border-border-soft px-4 py-2 text-sm transition-colors
            ${
              currentStep === 0
                ? "text-muted-light cursor-not-allowed border-transparent"
                : "text-ink-soft hover:border-ink hover:text-ink"
            }`}
          style={{ borderRadius: "3px" }}
        >
          ← Kembali
        </button>

        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`border-2 px-5 py-2 text-sm font-medium transition-colors
            ${
              isStepValid()
                ? "border-ink bg-ink text-paper hover:bg-ink-soft"
                : "border-border-soft bg-paper-card text-muted-light cursor-not-allowed"
            }`}
          style={{ borderRadius: "3px" }}
        >
          {currentStep === totalSteps - 1 ? "Selesai, mulai diskusi!" : "Lanjut →"}
        </button>
      </div>
    </div>
  );
}
