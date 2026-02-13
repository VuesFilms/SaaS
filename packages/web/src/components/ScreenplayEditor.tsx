import type { Editor } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useTranslation } from "react-i18next";
import {
  SceneHeading,
  Action,
  Character,
  Dialogue,
  Parenthetical,
  Transition,
} from "../editor/extensions";
import {
  setSceneHeading,
  setAction,
  setCharacter,
  setDialogue,
  setParenthetical,
  setTransition,
  BLOCK_TYPES,
} from "../editor/commands";
import { exportPDF, exportWord, importFile } from "../editor/io";

const blockTypeCommands: Record<string, (editor: Editor) => boolean> = {
  sceneHeading: (editor) => setSceneHeading(editor),
  action: (editor) => setAction(editor),
  character: (editor) => setCharacter(editor),
  dialogue: (editor) => setDialogue(editor),
  parenthetical: (editor) => setParenthetical(editor),
  transition: (editor) => setTransition(editor),
};

const btnBase: React.CSSProperties = {
  padding: "6px 11px",
  border: "1px solid var(--toolbar-btn-border)",
  borderRadius: "7px",
  cursor: "pointer",
  fontSize: "12.5px",
  fontWeight: 500,
  backgroundColor: "var(--toolbar-btn-bg)",
  color: "var(--text-secondary)",
  transition: "all 0.15s ease",
  fontFamily: "var(--font-family)",
  lineHeight: 1.4,
  whiteSpace: "nowrap" as const,
};

const activeBtnStyle: React.CSSProperties = {
  ...btnBase,
  background: "var(--accent-gradient)",
  color: "#fff",
  borderColor: "transparent",
  boxShadow: "0 2px 8px var(--accent-primary-glow)",
};

const screenplayBtnBase: React.CSSProperties = {
  ...btnBase,
  fontSize: "11.5px",
  backgroundColor: "var(--accent-primary-light)",
  borderColor: "var(--accent-primary)",
  color: "var(--accent-primary)",
  fontWeight: 600,
  letterSpacing: "0.2px",
};

const screenplayActiveBtn: React.CSSProperties = {
  ...screenplayBtnBase,
  background: "var(--accent-gradient)",
  color: "#fff",
  borderColor: "transparent",
  boxShadow: "0 2px 8px var(--accent-primary-glow)",
};

const ioBtnStyle: React.CSSProperties = {
  ...btnBase,
  fontSize: "12px",
  fontWeight: 600,
  background: "var(--accent-gradient-subtle)",
  borderColor: "var(--border-primary)",
  color: "var(--accent-primary)",
};

function handleBtnHover(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.background = "var(--toolbar-btn-hover)";
  e.currentTarget.style.borderColor = "var(--accent-primary)";
  e.currentTarget.style.color = "var(--accent-primary)";
}

function handleBtnLeave(
  e: React.MouseEvent<HTMLButtonElement>,
  isActive: boolean,
) {
  if (!isActive) {
    e.currentTarget.style.background = "var(--toolbar-btn-bg)";
    e.currentTarget.style.borderColor = "var(--toolbar-btn-border)";
    e.currentTarget.style.color = "var(--text-secondary)";
  }
}

function handleIoBtnHover(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.background = "var(--accent-primary-light)";
  e.currentTarget.style.borderColor = "var(--accent-primary)";
  e.currentTarget.style.transform = "translateY(-1px)";
}

function handleIoBtnLeave(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.background = "var(--accent-gradient-subtle)";
  e.currentTarget.style.borderColor = "var(--border-primary)";
  e.currentTarget.style.transform = "translateY(0)";
}

export default function ScreenplayEditor() {
  const { t } = useTranslation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: t("app.editor") + "...",
      }),
      TextAlign.configure({
        types: [
          "heading",
          "paragraph",
          "sceneHeading",
          "action",
          "character",
          "dialogue",
          "parenthetical",
          "transition",
        ],
      }),
      Underline,
      SceneHeading,
      Action,
      Character,
      Dialogue,
      Parenthetical,
      Transition,
    ],
    content: "",
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      style={{
        border: "1px solid var(--card-border)",
        borderRadius: "14px",
        overflow: "hidden",
        background: "var(--card-bg)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "var(--shadow-lg)",
        transition: "all 0.25s ease",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          padding: "10px 14px",
          borderBottom: "1px solid var(--toolbar-border)",
          background: "var(--toolbar-bg)",
          backdropFilter: "blur(12px)",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Text formatting */}
        {[
          {
            label: "B",
            action: () => editor.chain().focus().toggleBold().run(),
            active: editor.isActive("bold"),
            extra: { fontWeight: 700 } as React.CSSProperties,
          },
          {
            label: "I",
            action: () => editor.chain().focus().toggleItalic().run(),
            active: editor.isActive("italic"),
            extra: { fontStyle: "italic" } as React.CSSProperties,
          },
          {
            label: "U",
            action: () => editor.chain().focus().toggleUnderline().run(),
            active: editor.isActive("underline"),
            extra: { textDecoration: "underline" } as React.CSSProperties,
          },
        ].map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            style={{
              ...(btn.active ? activeBtnStyle : btnBase),
              ...btn.extra,
              minWidth: "32px",
              textAlign: "center",
            }}
            onMouseEnter={(e) => !btn.active && handleBtnHover(e)}
            onMouseLeave={(e) => handleBtnLeave(e, btn.active)}
          >
            {btn.label}
          </button>
        ))}

        <Separator />

        {/* Headings */}
        {([1, 2, 3] as const).map((level) => (
          <button
            key={`h${level}`}
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
            style={
              editor.isActive("heading", { level })
                ? activeBtnStyle
                : btnBase
            }
            onMouseEnter={(e) =>
              !editor.isActive("heading", { level }) && handleBtnHover(e)
            }
            onMouseLeave={(e) =>
              handleBtnLeave(e, editor.isActive("heading", { level }))
            }
          >
            H{level}
          </button>
        ))}

        <Separator />

        {/* Alignment */}
        {(["left", "center", "right"] as const).map((align) => (
          <button
            key={align}
            type="button"
            onClick={() =>
              editor.chain().focus().setTextAlign(align).run()
            }
            style={
              editor.isActive({ textAlign: align })
                ? activeBtnStyle
                : btnBase
            }
            onMouseEnter={(e) =>
              !editor.isActive({ textAlign: align }) && handleBtnHover(e)
            }
            onMouseLeave={(e) =>
              handleBtnLeave(e, editor.isActive({ textAlign: align }))
            }
          >
            {t(`editor.${align}`)}
          </button>
        ))}

        <Separator />

        {/* Screenplay blocks */}
        {BLOCK_TYPES.map((blockType) => (
          <button
            key={blockType.name}
            type="button"
            title={`${t(blockType.i18nKey)} (${blockType.shortcut})`}
            onClick={() => {
              const command = blockTypeCommands[blockType.name];
              if (command) command(editor);
            }}
            style={
              editor.isActive(blockType.name)
                ? screenplayActiveBtn
                : screenplayBtnBase
            }
          >
            {t(blockType.i18nKey)}
          </button>
        ))}

        <Separator />

        {/* Import/Export */}
        <button
          type="button"
          onClick={() => exportPDF(editor)}
          style={ioBtnStyle}
          onMouseEnter={handleIoBtnHover}
          onMouseLeave={handleIoBtnLeave}
        >
          {t("editor.exportPDF")}
        </button>
        <button
          type="button"
          onClick={() => exportWord(editor)}
          style={ioBtnStyle}
          onMouseEnter={handleIoBtnHover}
          onMouseLeave={handleIoBtnLeave}
        >
          {t("editor.exportWord")}
        </button>
        <button
          type="button"
          onClick={() => importFile(editor)}
          style={ioBtnStyle}
          onMouseEnter={handleIoBtnHover}
          onMouseLeave={handleIoBtnLeave}
        >
          {t("editor.importFile")}
        </button>
      </div>

      {/* Editor content */}
      <div
        style={{
          minHeight: "460px",
          background: "var(--editor-bg)",
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Separator() {
  return (
    <span
      style={{
        width: "1px",
        backgroundColor: "var(--toolbar-border)",
        margin: "0 4px",
        alignSelf: "stretch",
        minHeight: "24px",
        opacity: 0.6,
      }}
    />
  );
}
