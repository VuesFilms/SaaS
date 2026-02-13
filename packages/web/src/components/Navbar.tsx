import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext.js";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 28px",
        background: "var(--nav-bg)",
        borderBottom: "1px solid var(--nav-border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "all 0.25s ease",
      }}
    >
      <Link
        to="/dashboard"
        style={{
          fontSize: "20px",
          fontWeight: 800,
          background: "var(--accent-gradient)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textDecoration: "none",
          letterSpacing: "-0.5px",
        }}
      >
        {t("app.title")}
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: 500,
            padding: "7px 14px",
            borderRadius: "8px",
            transition: "all 0.15s ease",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.background = "var(--accent-primary-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          {t("app.dashboard")}
        </Link>
        <Link
          to="/login"
          style={{
            textDecoration: "none",
            color: "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: 500,
            padding: "7px 14px",
            borderRadius: "8px",
            transition: "all 0.15s ease",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.background = "var(--accent-primary-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          {t("app.login")}
        </Link>

        <div
          style={{
            width: "1px",
            height: "20px",
            background: "var(--border-primary)",
            margin: "0 4px",
          }}
        />

        <button
          type="button"
          onClick={toggleLanguage}
          title={t("app.language")}
          style={{
            padding: "7px 12px",
            border: "1px solid var(--border-primary)",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            backgroundColor: "var(--toolbar-btn-bg)",
            color: "var(--text-secondary)",
            transition: "all 0.15s ease",
            fontFamily: "var(--font-family)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-primary)";
            e.currentTarget.style.color = "var(--accent-primary)";
            e.currentTarget.style.background = "var(--accent-primary-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-primary)";
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.background = "var(--toolbar-btn-bg)";
          }}
        >
          {i18n.language === "ar" ? "EN" : "AR"}
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          title={t("app.theme")}
          style={{
            padding: "7px 12px",
            border: "1px solid var(--border-primary)",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            backgroundColor: "var(--toolbar-btn-bg)",
            color: "var(--text-secondary)",
            transition: "all 0.15s ease",
            fontFamily: "var(--font-family)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-primary)";
            e.currentTarget.style.color = "var(--accent-primary)";
            e.currentTarget.style.background = "var(--accent-primary-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-primary)";
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.background = "var(--toolbar-btn-bg)";
          }}
        >
          <span style={{ fontSize: "15px" }}>
            {theme === "light" ? "\u263E" : "\u2600"}
          </span>
          {theme === "light" ? t("app.dark") : t("app.light")}
        </button>
      </div>
    </nav>
  );
}
