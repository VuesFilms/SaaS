import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        textAlign: "center",
        padding: "100px 20px",
        animation: "fadeInUp 0.4s ease both",
      }}
    >
      <h1
        style={{
          fontSize: "80px",
          margin: "0 0 4px 0",
          fontWeight: 800,
          background: "var(--accent-gradient)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-2px",
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "18px",
          color: "var(--text-tertiary)",
          marginBottom: "28px",
          fontWeight: 400,
        }}
      >
        Page not found
      </p>
      <Link
        to="/dashboard"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "11px 24px",
          background: "var(--accent-gradient)",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: 600,
          boxShadow: "var(--shadow-glow)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {t("app.dashboard")}
      </Link>
    </div>
  );
}
