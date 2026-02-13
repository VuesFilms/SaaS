import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef, useCallback } from "react";
import ScreenplayEditor from "../components/ScreenplayEditor.js";
import {
  getProject,
  createProject,
  renameProject,
  updateProjectContent,
} from "../store/projects";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [projectId, setProjectId] = useState(id === "new" ? null : id ?? null);
  const [title, setTitle] = useState("");
  const [initialContent, setInitialContent] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const projectIdRef = useRef(projectId);
  const latestContentRef = useRef<string | null>(null);

  // Keep projectIdRef in sync
  useEffect(() => {
    projectIdRef.current = projectId;
  }, [projectId]);

  // Load project on mount
  useEffect(() => {
    if (id === "new") {
      const project = createProject(t("app.untitledProject"));
      setProjectId(project.id);
      projectIdRef.current = project.id;
      setTitle(project.title);
      setInitialContent("");
      navigate(`/editor/${project.id}`, { replace: true });
    } else if (id) {
      setProjectId(id);
      projectIdRef.current = id;
      const project = getProject(id);
      if (project) {
        setTitle(project.title);
        setInitialContent(project.content);
      } else {
        setInitialContent("");
      }
    }
  }, [id, navigate, t]);

  // Focus title input when editing
  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleTitleSubmit = useCallback(() => {
    setIsEditingTitle(false);
    const trimmed = title.trim();
    if (trimmed && projectIdRef.current) {
      renameProject(projectIdRef.current, trimmed);
    } else if (!trimmed) {
      setTitle(t("app.untitledProject"));
      if (projectIdRef.current) renameProject(projectIdRef.current, t("app.untitledProject"));
    }
  }, [title, t]);

  const saveNow = useCallback(() => {
    const pid = projectIdRef.current;
    if (pid && latestContentRef.current !== null) {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      updateProjectContent(pid, latestContentRef.current);
      latestContentRef.current = null;
      setAutoSaveStatus(t("app.autoSaved"));
      setTimeout(() => setAutoSaveStatus(null), 2000);
    }
  }, [t]);

  const handleContentChange = useCallback(
    (html: string) => {
      latestContentRef.current = html;
      // Debounced auto-save
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        const pid = projectIdRef.current;
        if (pid) {
          updateProjectContent(pid, html);
          latestContentRef.current = null;
          setAutoSaveStatus(t("app.autoSaved"));
          setTimeout(() => setAutoSaveStatus(null), 2000);
        }
      }, 1000);
    },
    [t],
  );

  // Flush pending save on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      const pid = projectIdRef.current;
      if (pid && latestContentRef.current !== null) {
        updateProjectContent(pid, latestContentRef.current);
      }
    };
  }, []);

  // Also flush on browser close / refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      const pid = projectIdRef.current;
      if (pid && latestContentRef.current !== null) {
        updateProjectContent(pid, latestContentRef.current);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--border-primary)",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {/* Editable title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSubmit();
                if (e.key === "Escape") {
                  setIsEditingTitle(false);
                  const pid = projectIdRef.current;
                  if (pid) {
                    const p = getProject(pid);
                    if (p) setTitle(p.title);
                  }
                }
              }}
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.3px",
                background: "var(--bg-input, rgba(255,255,255,0.04))",
                border: "1px solid var(--accent-primary, #6366f1)",
                borderRadius: "8px",
                padding: "4px 12px",
                fontFamily: "var(--font-family)",
                outline: "none",
                flex: 1,
                minWidth: 0,
              }}
            />
          ) : (
            <h1
              onClick={() => setIsEditingTitle(true)}
              title={t("app.rename")}
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.3px",
                cursor: "pointer",
                padding: "4px 12px",
                borderRadius: "8px",
                border: "1px solid transparent",
                transition: "all 0.15s ease",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-primary)";
                e.currentTarget.style.background = "var(--toolbar-btn-bg, rgba(255,255,255,0.02))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {title}
            </h1>
          )}

          {/* Auto-save indicator */}
          {autoSaveStatus && (
            <span
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "var(--success, #10b981)",
                whiteSpace: "nowrap",
                opacity: 0.8,
              }}
            >
              {autoSaveStatus}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "9px 18px",
              border: "1px solid var(--border-primary)",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              backgroundColor: "var(--toolbar-btn-bg)",
              color: "var(--text-secondary)",
              transition: "all 0.15s ease",
              fontFamily: "var(--font-family)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--text-tertiary)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-primary)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            {t("app.dashboard")}
          </button>
          <button
            type="button"
            onClick={saveNow}
            style={{
              padding: "9px 22px",
              background: "var(--accent-gradient)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              boxShadow: "var(--shadow-glow)",
              transition: "all 0.2s ease",
              fontFamily: "var(--font-family)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 0 30px var(--accent-primary-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "var(--shadow-glow)";
            }}
          >
            {t("app.save")}
          </button>
        </div>
      </div>

      {initialContent !== null && (
        <ScreenplayEditor
          key={projectId}
          initialContent={initialContent}
          onContentChange={handleContentChange}
        />
      )}
    </div>
  );
}
