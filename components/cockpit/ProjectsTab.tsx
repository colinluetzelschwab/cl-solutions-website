"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

interface ProjectSummary {
  id: string;
  name: string;
  framework: string | null;
  status: string;
  url: string | null;
  lastDeployedAt: string | null;
  repo: string | null;
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  return new Date(dateStr).toLocaleDateString("en-CH", {
    month: "short",
    day: "numeric",
  });
}

function statusConfig(status: string): {
  color: string;
  label: string;
} {
  switch (status.toUpperCase()) {
    case "READY":
      return { color: "#22C55E", label: "Live" };
    case "BUILDING":
    case "QUEUED":
    case "INITIALIZING":
      return { color: "#F59E0B", label: "Building" };
    case "ERROR":
    case "CANCELED":
      return { color: "#EF4444", label: "Error" };
    default:
      return { color: "#71717A", label: status };
  }
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between py-4 animate-pulse">
      <div className="flex-1">
        <div className="h-4 w-32 rounded bg-background-elevated" />
        <div className="mt-2 flex items-center gap-2">
          <div className="h-3 w-14 rounded bg-background-elevated" />
          <div className="h-3 w-16 rounded bg-background-elevated" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-10 rounded bg-background-elevated" />
      </div>
    </div>
  );
}

export default function ProjectsTab() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/projects")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load");
        const data = (await res.json()) as { projects: ProjectSummary[] };
        setProjects(data.projects);
      })
      .catch(() => setError("Failed to load projects"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="px-4 pt-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
        {!isLoading && !error && projects.length > 0 && (
          <span className="text-sm text-text-muted">{projects.length}</span>
        )}
      </div>

      <div className="mt-4">
        {isLoading && (
          <div className="divide-y divide-[rgba(255,255,255,0.06)]">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        )}

        {error && (
          <p className="mt-8 text-center text-sm text-red-400">{error}</p>
        )}

        {!isLoading && !error && projects.length === 0 && (
          <p className="mt-16 text-center text-sm text-text-muted">
            No projects
          </p>
        )}

        {!isLoading && !error && projects.length > 0 && (
          <div className="divide-y divide-[rgba(255,255,255,0.06)]">
            {projects.map((project) => {
              const { color, label } = statusConfig(project.status);
              return (
                <button
                  key={project.id}
                  onClick={() => {
                    if (project.url) {
                      window.open(project.url, "_blank", "noopener");
                    }
                  }}
                  className="flex w-full items-center justify-between py-4 text-left active:opacity-70 transition-opacity"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-base font-medium text-text-primary truncate">
                      {project.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {project.framework && (
                        <span className="text-[10px] text-text-muted">
                          {project.framework}
                        </span>
                      )}
                      {project.lastDeployedAt && (
                        <span className="text-[11px] text-text-muted">
                          {relativeTime(project.lastDeployedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="block h-2 w-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[11px] text-text-muted">
                        {label}
                      </span>
                    </div>
                    {project.url && (
                      <ExternalLink className="h-3.5 w-3.5 text-text-muted" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
