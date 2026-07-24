

"use client";

import Link from "next/link";
import type { Project } from "@/lib/types";

const ROTATIONS = [-1.2, 0.5, -0.6, 0.8, -0.3, 0.4, -0.9, 0.2];

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
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

  return (
    <Link
      href={`/project/${project.id}`}
      className="card-pin block border-2 border-border-soft bg-paper-card p-5 pt-6
                 transition-all hover:border-sage hover:-translate-y-0.5"
      style={{
        transform: `rotate(${rotation}deg)`,
        borderRadius: "3px",
        maxWidth: "280px",
        minWidth: "240px",
      }}
    >

      <h3 className="font-serif text-base font-semibold text-ink leading-snug mb-3">
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
