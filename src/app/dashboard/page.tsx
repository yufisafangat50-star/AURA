

"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import ProjectCard from "@/components/dashboard/ProjectCard";
import EmptyState from "@/components/dashboard/EmptyState";

export default function DashboardPage() {
  const router = useRouter();
  const { projects, genome } = useApp();

  const handleCreateProject = () => {
    if (genome) {

      router.push("/interview?mode=delta");
    } else {

      router.push("/interview");
    }
  };

  return (
    <div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">
            Project kamu
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Semua riset yang sedang kamu eksplorasi.
          </p>
        </div>

        {projects.length > 0 && (
          <button
            onClick={handleCreateProject}
            className="border-2 border-ink bg-ink px-5 py-2 text-sm font-medium text-sage
                       transition-colors hover:bg-ink-soft"
            style={{ borderRadius: "3px" }}
          >
            + Mulai project baru
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState onCreateProject={handleCreateProject} />
      ) : (
        <div className="flex flex-wrap gap-8 pt-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
