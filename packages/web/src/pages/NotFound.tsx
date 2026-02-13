import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const containerStyles: React.CSSProperties = {
  textAlign: "center",
  padding: "80px 20px",
};

const linkStyles: React.CSSProperties = {
  display: "inline-block",
  marginTop: "16px",
  padding: "10px 20px",
  backgroundColor: "#2563eb",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: 600,
};

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div style={containerStyles}>
      <h1 style={{ fontSize: "72px", margin: "0 0 8px 0", color: "#d1d5db" }}>
        404
      </h1>
      <p style={{ fontSize: "18px", color: "#6b7280", marginBottom: "24px" }}>
        Page not found
      </p>
      <Link to="/" style={linkStyles}>
        {t("app.dashboard")}
      </Link>
    </div>
  );
}
