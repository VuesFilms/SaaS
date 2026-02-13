import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  updatedAt: string;
}

const mockProjects: Project[] = [
  { id: "1", title: "My First Screenplay", updatedAt: "2025-01-15" },
  { id: "2", title: "Action Movie Draft", updatedAt: "2025-02-20" },
  { id: "3", title: "Drama Series - Episode 1", updatedAt: "2025-03-10" },
];

const containerStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const headerStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const projectGridStyles: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "16px",
};

const projectCardStyles: React.CSSProperties = {
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "20px",
  textDecoration: "none",
  color: "inherit",
  transition: "box-shadow 0.2s ease",
  cursor: "pointer",
};

const buttonStyles: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
};

const emptyStateStyles: React.CSSProperties = {
  textAlign: "center",
  padding: "60px 20px",
  color: "#6b7280",
};

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>{t("app.projects")}</h1>
        <Link to="/editor/new" style={buttonStyles}>
          + {t("app.newProject")}
        </Link>
      </div>

      {mockProjects.length === 0 ? (
        <div style={emptyStateStyles}>
          <h2>{t("app.noProjects")}</h2>
          <p>{t("app.createFirst")}</p>
          <Link to="/editor/new" style={buttonStyles}>
            + {t("app.newProject")}
          </Link>
        </div>
      ) : (
        <div style={projectGridStyles}>
          {mockProjects.map((project) => (
            <Link
              key={project.id}
              to={`/editor/${project.id}`}
              style={projectCardStyles}
            >
              <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
                {project.title}
              </h3>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>
                {project.updatedAt}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
