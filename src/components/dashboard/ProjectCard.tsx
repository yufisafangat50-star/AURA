

"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/lib/types";
import { useApp } from "@/lib/context";

const ROTATIONS = [-1.2, 0.5, -0.6, 0.8, -0.3, 0.4, -0.9, 0.2];

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const { deleteProject } = useApp();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const rotation = ROTATIONS[index % ROTATIONS.length];

  const statusLabel: Record<string, string> = {
    draft: "Draf",
    active: "Aktif",
    archived: "Diarsipkan",
  };

  const statusColor: Record<string, string> = {
    draft: "text-muted-text",
    active: "text-sage",
    archived: "text-muted-light",
  };

  const formattedDate = new Date(project.updated_at).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsConfirming(true);
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await deleteProject(project.id);
    } catch (error) {
      console.error("Gagal menghapus project:", error);
      setIsDeleting(false);
      setIsConfirming(false);
    }
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsConfirming(false);
  };

  if (isConfirming) {
    return (
      <div
        className="card-pin flex flex-col justify-center items-center border-2 border-sage bg-paper-card p-5
                   transition-all"
        style={{
          transform: `rotate(${rotation}deg)`,
          borderRadius: "3px",
          maxWidth: "280px",
          minWidth: "240px",
          minHeight: "135px",
        }}
      >
        <p className="text-sm font-medium text-ink mb-4 text-center">Hapus "{project.title}"?</p>
        <div className="flex gap-3">
          <button onClick={cancelDelete} disabled={isDeleting} className="text-xs font-medium text-ink-soft hover:text-ink px-4 py-1.5 border-2 border-border-soft rounded bg-transparent hover:bg-paper transition-colors">
            Batal
          </button>
          <button onClick={confirmDelete} disabled={isDeleting} className="text-xs font-medium text-paper bg-ink hover:bg-red-800 px-4 py-1.5 rounded border-2 border-ink hover:border-red-800 transition-colors disabled:opacity-50">
            {isDeleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/project/${project.id}`}
      className="group card-pin block border-2 border-border-soft bg-paper-card p-5 pt-6
                 transition-all hover:border-sage hover:-translate-y-0.5 relative"
      style={{
        transform: `rotate(${rotation}deg)`,
        borderRadius: "3px",
        maxWidth: "280px",
        minWidth: "240px",
        opacity: isDeleting ? 0.5 : 1,
        pointerEvents: isDeleting ? "none" : "auto",
      }}
    >
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDelete}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-paper-card-alt text-ink-soft hover:bg-ink hover:text-paper transition-colors"
          title="Hapus Project"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <h3 className="font-serif text-base font-semibold text-ink leading-snug mb-3 pr-6">
        {project.title}
      </h3>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${statusColor[project.status]}`}>
          {statusLabel[project.status]}
        </span>
        <span className="text-xs text-muted-light">{formattedDate}</span>
      </div>
    </Link>
  );
}
