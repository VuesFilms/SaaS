import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  getProjects,
  createProject,
  renameProject,
  type Project,
} from "../store/projects";

/* ───── Right-click context menu ───── */
function ProjectContextMenu({
  x,
  y,
  project,
  onRename,
  onClose,
}: {
  x: number;
  y: number;
  project: Project;
  onRename: (project: Project) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 1000,
        background: "var(--bg-elevated, rgba(17, 24, 39, 0.95))",
        border: "1px solid var(--border-primary, rgba(255,255,255,0.1))",
        borderRadius: "12px",
        padding: "6px",
        minWidth: "160px",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.1)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <button
        type="button"
        onClick={() => {
          onRename(project);
          onClose();
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          padding: "9px 12px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 500,
          fontFamily: "var(--font-family)",
          background: hovered
            ? "var(--toolbar-btn-hover, rgba(255,255,255,0.06))"
            : "transparent",
          color: hovered
            ? "var(--accent-primary, #a78bfa)"
            : "var(--text-secondary, #94a3b8)",
          transition: "all 0.15s ease",
          textAlign: "start",
        }}
      >
        {t("app.rename")}
      </button>
    </div>
  );
}

/* ───── Inline rename modal ───── */
function RenameModal({
  project,
  onConfirm,
  onCancel,
}: {
  project: Project;
  onConfirm: (id: string, newName: string) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState(project.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== project.title) {
      onConfirm(project.id, trimmed);
    }
    onCancel();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-elevated, rgba(17, 24, 39, 0.98))",
          border: "1px solid var(--border-primary, rgba(255,255,255,0.1))",
          borderRadius: "16px",
          padding: "28px",
          minWidth: "360px",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.1)",
        }}
      >
        <h3
          style={{
            margin: "0 0 16px 0",
            fontSize: "17px",
            fontWeight: 700,
            color: "var(--text-primary, #f1f5f9)",
          }}
        >
          {t("app.renameProject")}
        </h3>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") onCancel();
          }}
          placeholder={t("app.enterNewName")}
          style={{
            width: "100%",
            padding: "10px 14px",
            border: "1px solid var(--border-primary, rgba(255,255,255,0.1))",
            borderRadius: "10px",
            background: "var(--bg-input, rgba(255,255,255,0.04))",
            color: "var(--text-primary, #f1f5f9)",
            fontSize: "14px",
            fontFamily: "var(--font-family)",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-primary, #6366f1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-primary, rgba(255,255,255,0.1))";
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "18px",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "8px 18px",
              border: "1px solid var(--border-primary)",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              backgroundColor: "var(--toolbar-btn-bg, transparent)",
              color: "var(--text-secondary, #94a3b8)",
              fontFamily: "var(--font-family)",
              transition: "all 0.15s ease",
            }}
          >
            {t("app.cancel")}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              padding: "8px 22px",
              background: "var(--accent-gradient, linear-gradient(135deg, #6366f1, #8b5cf6))",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "var(--font-family)",
              transition: "all 0.15s ease",
            }}
          >
            {t("app.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───── Project card ───── */
function ProjectCard({
  project,
  onContextMenu,
}: {
  project: Project;
  onContextMenu: (e: React.MouseEvent, project: Project) => void;
}) {
  const genreColors: Record<string, string> = {
    Drama: "var(--accent-primary)",
    Action: "var(--warning)",
    Series: "var(--success)",
  };

  return (
    <Link
      to={`/editor/${project.id}`}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e, project);
      }}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "16px",
        padding: "24px",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "var(--shadow-md)",
        transition: "all 0.25s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        animation: "fadeInUp 0.4s ease both",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-card-hover)";
        e.currentTarget.style.borderColor = "var(--accent-primary-light)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.borderColor = "var(--card-border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Top gradient accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "var(--accent-gradient)",
          borderRadius: "16px 16px 0 0",
          opacity: 0.7,
        }}
      />

      {/* Genre badge */}
      <div
        style={{
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: "6px",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          color: genreColors[project.genre] || "var(--accent-primary)",
          background:
            project.genre === "Action"
              ? "var(--warning-light)"
              : project.genre === "Series"
                ? "var(--success-light)"
                : "var(--accent-primary-light)",
          marginBottom: "14px",
        }}
      >
        {project.genre}
      </div>

      <h3
        style={{
          margin: "0 0 10px 0",
          fontSize: "17px",
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.3,
        }}
      >
        {project.title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "var(--text-tertiary)",
          fontSize: "13px",
          fontWeight: 400,
        }}
      >
        {project.updatedAt}
      </p>
    </Link>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    project: Project;
  } | null>(null);
  const [renamingProject, setRenamingProject] = useState<Project | null>(null);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, project: Project) => {
      setContextMenu({ x: e.clientX, y: e.clientY, project });
    },
    [],
  );

  const handleRename = useCallback((id: string, newName: string) => {
    renameProject(id, newName);
    setProjects(getProjects());
  }, []);

  const handleNewProject = () => {
    const project = createProject(t("app.untitledProject"));
    navigate(`/editor/${project.id}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 4px 0",
              fontSize: "28px",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.5px",
            }}
          >
            {t("app.projects")}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "var(--text-tertiary)",
            }}
          >
            {t("app.recentWork")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewProject}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 22px",
            background: "var(--accent-gradient)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "var(--shadow-glow)",
            transition: "all 0.2s ease",
            letterSpacing: "0.2px",
            fontFamily: "var(--font-family)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 0 40px var(--accent-primary-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "var(--shadow-glow)";
          }}
        >
          + {t("app.newProject")}
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: "20px",
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              marginBottom: "16px",
              opacity: 0.4,
            }}
          >
            {"\uD83C\uDFAC"}
          </div>
          <h2
            style={{
              fontSize: "20px",
              color: "var(--text-primary)",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            {t("app.noProjects")}
          </h2>
          <p
            style={{
              color: "var(--text-tertiary)",
              fontSize: "15px",
              marginBottom: "24px",
            }}
          >
            {t("app.createFirst")}
          </p>
          <button
            type="button"
            onClick={handleNewProject}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 22px",
              background: "var(--accent-gradient)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 600,
              boxShadow: "var(--shadow-glow)",
              cursor: "pointer",
              fontFamily: "var(--font-family)",
            }}
          >
            + {t("app.newProject")}
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: "20px",
          }}
        >
          {projects.map((project, idx) => (
            <div
              key={project.id}
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <ProjectCard
                project={project}
                onContextMenu={handleContextMenu}
              />
            </div>
          ))}
        </div>
      )}

      {/* Right-click context menu */}
      {contextMenu && (
        <ProjectContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          project={contextMenu.project}
          onRename={(p) => setRenamingProject(p)}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Rename modal */}
      {renamingProject && (
        <RenameModal
          project={renamingProject}
          onConfirm={handleRename}
          onCancel={() => setRenamingProject(null)}
        />
      )}
    </div>
  );
}
