import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", { email, password });
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "60px auto",
        padding: "36px",
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "20px",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "var(--shadow-lg)",
        position: "relative",
        overflow: "hidden",
        animation: "fadeInUp 0.4s ease both",
      }}
    >
      {/* Top gradient line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "var(--accent-gradient)",
        }}
      />

      <h1
        style={{
          textAlign: "center",
          marginBottom: "28px",
          fontSize: "24px",
          fontWeight: 800,
          color: "var(--text-primary)",
          letterSpacing: "-0.5px",
        }}
      >
        {t("app.login")}
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "18px" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "7px",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              letterSpacing: "0.3px",
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "11px 14px",
              border: "1px solid var(--border-primary)",
              borderRadius: "10px",
              fontSize: "14px",
              boxSizing: "border-box",
              backgroundColor: "var(--bg-input)",
              color: "var(--text-primary)",
              outline: "none",
              transition: "all 0.15s ease",
              fontFamily: "var(--font-family)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-primary)";
              e.currentTarget.style.backgroundColor = "var(--bg-input-focus)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px var(--accent-primary-light)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border-primary)";
              e.currentTarget.style.backgroundColor = "var(--bg-input)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "7px",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              letterSpacing: "0.3px",
            }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "11px 14px",
              border: "1px solid var(--border-primary)",
              borderRadius: "10px",
              fontSize: "14px",
              boxSizing: "border-box",
              backgroundColor: "var(--bg-input)",
              color: "var(--text-primary)",
              outline: "none",
              transition: "all 0.15s ease",
              fontFamily: "var(--font-family)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-primary)";
              e.currentTarget.style.backgroundColor = "var(--bg-input-focus)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px var(--accent-primary-light)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border-primary)";
              e.currentTarget.style.backgroundColor = "var(--bg-input)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "13px",
            background: "var(--accent-gradient)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 700,
            boxShadow: "var(--shadow-glow)",
            transition: "all 0.2s ease",
            fontFamily: "var(--font-family)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 0 35px var(--accent-primary-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "var(--shadow-glow)";
          }}
        >
          {t("app.login")}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "14px",
          color: "var(--text-tertiary)",
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          style={{
            color: "var(--accent-primary)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          {t("app.register")}
        </Link>
      </p>
    </div>
  );
}
