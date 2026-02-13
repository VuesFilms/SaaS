import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ScreenplayEditor from "../components/ScreenplayEditor.js";

const headerStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  paddingBottom: "16px",
  borderBottom: "1px solid #e0e0e0",
};

const toolbarStyles: React.CSSProperties = {
  display: "flex",
  gap: "8px",
};

const buttonStyles: React.CSSProperties = {
  padding: "8px 16px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  backgroundColor: "#fff",
};

const saveButtonStyles: React.CSSProperties = {
  ...buttonStyles,
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  fontWeight: 600,
};

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const handleSave = () => {
    console.log("Saving project:", id);
  };

  return (
    <div>
      <div style={headerStyles}>
        <h1 style={{ margin: 0, fontSize: "20px" }}>
          {t("app.editor")} {id !== "new" ? `- #${id}` : ""}
        </h1>
        <div style={toolbarStyles}>
          <button type="button" style={buttonStyles} onClick={() => window.history.back()}>
            {t("app.cancel")}
          </button>
          <button type="button" style={saveButtonStyles} onClick={handleSave}>
            {t("app.save")}
          </button>
        </div>
      </div>

      <ScreenplayEditor />
    </div>
  );
}
