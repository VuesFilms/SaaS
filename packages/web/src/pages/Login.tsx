import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const formContainerStyles: React.CSSProperties = {
  maxWidth: "400px",
  margin: "60px auto",
  padding: "32px",
  border: "1px solid #e0e0e0",
  borderRadius: "12px",
};

const inputStyles: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  boxSizing: "border-box",
};

const labelStyles: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  fontSize: "14px",
  fontWeight: 500,
};

const fieldStyles: React.CSSProperties = {
  marginBottom: "16px",
};

const buttonStyles: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: 600,
};

const linkStyles: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "none",
};

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", { email, password });
  };

  return (
    <div style={formContainerStyles}>
      <h1 style={{ textAlign: "center", marginBottom: "24px", fontSize: "22px" }}>
        {t("app.login")}
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={fieldStyles}>
          <label htmlFor="email" style={labelStyles}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyles}
            required
          />
        </div>

        <div style={fieldStyles}>
          <label htmlFor="password" style={labelStyles}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyles}
            required
          />
        </div>

        <button type="submit" style={buttonStyles}>
          {t("app.login")}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px" }}>
        Don&apos;t have an account?{" "}
        <Link to="/register" style={linkStyles}>
          {t("app.register")}
        </Link>
      </p>
    </div>
  );
}
