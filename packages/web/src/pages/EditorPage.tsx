import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ScreenplayEditor from "../components/ScreenplayEditor.js";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const handleSave = () => {
    console.log("Saving project:", id);
  };

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
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.3px",
          }}
        >
          {t("app.editor")} {id !== "new" ? `- #${id}` : ""}
        </h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={() => window.history.back()}
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
            {t("app.cancel")}
          </button>
          <button
            type="button"
            onClick={handleSave}
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

      <ScreenplayEditor />
    </div>
  );
}
