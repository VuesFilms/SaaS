import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext.js";

const navStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 24px",
  borderBottom: "1px solid #e0e0e0",
  backgroundColor: "#fff",
};

const brandStyles: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 700,
  color: "#2563eb",
  textDecoration: "none",
};

const navLinksStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const linkStyles: React.CSSProperties = {
  textDecoration: "none",
  color: "#374151",
  fontSize: "14px",
  fontWeight: 500,
};

const toggleButtonStyles: React.CSSProperties = {
  padding: "6px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  backgroundColor: "transparent",
  fontWeight: 500,
};

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  return (
    <nav style={navStyles}>
      <Link to="/" style={brandStyles}>
        {t("app.title")}
      </Link>

      <div style={navLinksStyles}>
        <Link to="/" style={linkStyles}>
          {t("app.dashboard")}
        </Link>
        <Link to="/login" style={linkStyles}>
          {t("app.login")}
        </Link>

        <button
          type="button"
          onClick={toggleLanguage}
          style={toggleButtonStyles}
          title={t("app.language")}
        >
          {i18n.language === "ar" ? "EN" : "AR"}
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          style={toggleButtonStyles}
          title={t("app.theme")}
        >
          {theme === "light" ? t("app.dark") : t("app.light")}
        </button>
      </div>
    </nav>
  );
}
