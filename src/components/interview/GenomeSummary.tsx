"use client";

import { useState } from "react";
import type { Genome, InterviewFormData } from "@/lib/types";
import ChipSelect from "@/components/interview/ChipSelect";
import { FIELD_OPTIONS, SKILL_OPTIONS, DATA_ACCESS_OPTIONS } from "@/data/mock";

interface GenomeSummaryProps {
  genome: Genome;
  onConfirm: () => void;
  onSave: (data: InterviewFormData) => void;
}

export default function GenomeSummary({
  genome,
  onConfirm,
  onSave,
}: GenomeSummaryProps) {
  const [isGlobalEditing, setIsGlobalEditing] = useState(false);
  const [editingField, setEditingField] = useState<keyof InterviewFormData | null>(null);
  const [formData, setFormData] = useState<InterviewFormData>({
    fields_of_interest: genome.fields_of_interest || [],
    skills: genome.skills || [],
    experience_description: "", 
    data_access: genome.data_access || [],
    constraints: genome.constraints || "",
    open_ended: genome.research_style_notes || "",
  });

  const handleSaveAll = () => {
    onSave(formData);
  };

  const renderEditableSection = (
    fieldKey: keyof InterviewFormData,
    label: string,
    content: React.ReactNode,
    editor: React.ReactNode
  ) => {
    const isEditing = editingField === fieldKey;

    return (
      <div className="relative group rounded -mx-3 px-3 py-2 transition-colors hover:bg-paper">
        <div className="flex items-center justify-between mb-1.5">
          <span className="label-caps">{label}</span>
          {isGlobalEditing && !isEditing && (
            <button
              onClick={() => setEditingField(fieldKey)}
              className="text-xs font-medium text-ink-soft hover:text-ink hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Edit
            </button>
          )}
          {isEditing && (
            <button
              onClick={() => setEditingField(null)}
              className="text-xs font-medium text-sage-dark hover:text-sage-dark/80 hover:underline"
            >
              Selesai edit
            </button>
          )}
        </div>
        {isEditing ? (
          <div className="mt-2 animate-in fade-in slide-in-from-top-1">
            {editor}
          </div>
        ) : (
          content
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-xl">
      <h2 className="font-serif text-xl font-semibold text-ink mb-2">
        Sebelum mulai, cek dulu profil riset kamu
      </h2>
      <p className="text-sm text-ink-soft mb-6">
        Ini yang kami tahu tentang kamu dari sesi sebelumnya. Masih relevan,
        atau ada yang berubah?
      </p>

      <div
        className="card-pin border-2 border-border-soft bg-paper-card p-6 pt-7 mb-6"
        style={{ borderRadius: "3px", transform: "rotate(-0.5deg)" }}
      >
        <div className="space-y-2">
          {renderEditableSection(
            "fields_of_interest",
            "Bidang minat",
            <div className="flex flex-wrap gap-1.5">
              {formData.fields_of_interest.map((field) => (
                <span
                  key={field}
                  className="border border-border-soft bg-paper px-2 py-0.5 text-xs text-ink-soft"
                  style={{ borderRadius: "2px" }}
                >
                  {field}
                </span>
              ))}
              {formData.fields_of_interest.length === 0 && <span className="text-xs text-ink-soft italic">Belum ada data</span>}
            </div>,
            <ChipSelect
              options={FIELD_OPTIONS}
              selected={formData.fields_of_interest}
              onChange={(selected) => setFormData({ ...formData, fields_of_interest: selected })}
              allowCustom
              customPlaceholder="Bidang lain..."
            />
          )}

          {renderEditableSection(
            "skills",
            "Skills & tools",
            <div className="flex flex-wrap gap-1.5">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="border border-border-soft bg-paper px-2 py-0.5 text-xs text-ink-soft"
                  style={{ borderRadius: "2px" }}
                >
                  {skill}
                </span>
              ))}
              {formData.skills.length === 0 && <span className="text-xs text-ink-soft italic">Belum ada data</span>}
            </div>,
            <ChipSelect
              options={SKILL_OPTIONS}
              selected={formData.skills}
              onChange={(selected) => setFormData({ ...formData, skills: selected })}
              allowCustom
              customPlaceholder="Skill lain..."
            />
          )}

          {renderEditableSection(
            "data_access",
            "Akses data",
            <div className="flex flex-wrap gap-1.5">
              {formData.data_access.map((d) => (
                <span
                  key={d}
                  className="border border-border-soft bg-paper px-2 py-0.5 text-xs text-ink-soft"
                  style={{ borderRadius: "2px" }}
                >
                  {d}
                </span>
              ))}
              {formData.data_access.length === 0 && <span className="text-xs text-ink-soft italic">Belum ada data</span>}
            </div>,
            <ChipSelect
              options={DATA_ACCESS_OPTIONS}
              selected={formData.data_access}
              onChange={(selected) => setFormData({ ...formData, data_access: selected })}
              allowCustom
              customPlaceholder="Akses data lain..."
            />
          )}

          {renderEditableSection(
            "constraints",
            "Keterbatasan",
            <p className="text-sm text-ink-soft whitespace-pre-wrap">{formData.constraints || <span className="italic">Belum ada data</span>}</p>,
            <textarea
              className="w-full rounded border border-border-soft bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none min-h-[100px]"
              value={formData.constraints}
              onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
              placeholder="Waktu, biaya, akses lokasi..."
            />
          )}

          {renderEditableSection(
            "open_ended",
            "Catatan gaya riset",
            <p className="text-sm text-ink-soft whitespace-pre-wrap">{formData.open_ended || <span className="italic">Belum ada data</span>}</p>,
            <textarea
              className="w-full rounded border border-border-soft bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none min-h-[100px]"
              value={formData.open_ended}
              onChange={(e) => setFormData({ ...formData, open_ended: e.target.value })}
              placeholder="Catatan masalah yang ingin diteliti..."
            />
          )}
        </div>
      </div>

      {!isGlobalEditing ? (
        <>
          <p className="text-sm text-ink mb-4 font-medium">
            Masih relevan, atau ada yang baru?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="border-2 border-ink bg-ink px-5 py-2 text-sm font-medium text-paper
                         transition-colors hover:bg-ink-soft"
              style={{ borderRadius: "3px" }}
            >
              Masih relevan, lanjut!
            </button>
            <button
              onClick={() => setIsGlobalEditing(true)}
              className="border-2 border-border-soft bg-paper-card px-5 py-2 text-sm font-medium
                         text-ink-soft transition-colors hover:border-ink hover:text-ink"
              style={{ borderRadius: "3px" }}
            >
              Ada yang berubah
            </button>
          </div>
        </>
      ) : (
        <div className="flex gap-3 mt-4 pt-4 border-t border-border-soft">
          <button
            onClick={handleSaveAll}
            className="border-2 border-ink bg-ink px-5 py-2 text-sm font-medium text-paper
                       transition-colors hover:bg-ink-soft"
            style={{ borderRadius: "3px" }}
          >
            Simpan Perubahan & Lanjut
          </button>
          <button
            onClick={() => {
              setIsGlobalEditing(false);
              setEditingField(null);
              
              setFormData({
                fields_of_interest: genome.fields_of_interest || [],
                skills: genome.skills || [],
                experience_description: "",
                data_access: genome.data_access || [],
                constraints: genome.constraints || "",
                open_ended: genome.research_style_notes || "",
              });
            }}
            className="px-5 py-2 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
          >
            Batal
          </button>
        </div>
      )}
    </div>
  );
}
