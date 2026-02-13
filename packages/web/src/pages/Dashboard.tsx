import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  updatedAt: string;
  genre: string;
}

const mockProjects: Project[] = [
  { id: "1", title: "My First Screenplay", updatedAt: "2025-01-15", genre: "Drama" },
  { id: "2", title: "Action Movie Draft", updatedAt: "2025-02-20", genre: "Action" },
  { id: "3", title: "Drama Series - Episode 1", updatedAt: "2025-03-10", genre: "Series" },
];

function ProjectCard({ project }: { project: Project }) {
  const genreColors: Record<string, string> = {
    Drama: "var(--accent-primary)",
    Action: "var(--warning)",
    Series: "var(--success)",
  };

  return (
    <Link
      to={`/editor/${project.id}`}
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

        <Link
          to="/editor/new"
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
        </Link>
      </div>

      {/* Projects Grid */}
      {mockProjects.length === 0 ? (
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
          <Link
            to="/editor/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 22px",
              background: "var(--accent-gradient)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              boxShadow: "var(--shadow-glow)",
            }}
          >
            + {t("app.newProject")}
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: "20px",
          }}
        >
          {mockProjects.map((project, idx) => (
            <div
              key={project.id}
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
