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

const editorContainerStyles: React.CSSProperties = {
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  minHeight: "500px",
  overflow: "hidden",
};

const toolbarStyles: React.CSSProperties = {
  display: "flex",
  gap: "4px",
  padding: "8px 12px",
  borderBottom: "1px solid #e0e0e0",
  backgroundColor: "#f9fafb",
  flexWrap: "wrap",
  alignItems: "center",
};

const toolbarButtonStyles: React.CSSProperties = {
  padding: "6px 10px",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
  backgroundColor: "#fff",
  fontWeight: 500,
};

const activeButtonStyles: React.CSSProperties = {
  ...toolbarButtonStyles,
  backgroundColor: "#2563eb",
  color: "#fff",
  borderColor: "#2563eb",
};

const screenplayButtonStyles: React.CSSProperties = {
  ...toolbarButtonStyles,
  fontSize: "12px",
  backgroundColor: "#fef3c7",
  borderColor: "#f59e0b",
  color: "#92400e",
};

const screenplayActiveButtonStyles: React.CSSProperties = {
  ...screenplayButtonStyles,
  backgroundColor: "#f59e0b",
  color: "#fff",
  borderColor: "#d97706",
};

const separatorStyles: React.CSSProperties = {
  width: "1px",
  backgroundColor: "#d1d5db",
  margin: "0 4px",
  alignSelf: "stretch",
};

const contentStyles: React.CSSProperties = {
  padding: "20px",
  minHeight: "460px",
};

const blockTypeCommands: Record<string, (editor: Editor) => boolean> = {
  sceneHeading: (editor) => setSceneHeading(editor),
  action: (editor) => setAction(editor),
  character: (editor) => setCharacter(editor),
  dialogue: (editor) => setDialogue(editor),
  parenthetical: (editor) => setParenthetical(editor),
  transition: (editor) => setTransition(editor),
};

export default function ScreenplayEditor() {
  const { t } = useTranslation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
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
    <div style={editorContainerStyles}>
      <div style={toolbarStyles}>
        {/* Text formatting buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={editor.isActive("bold") ? activeButtonStyles : toolbarButtonStyles}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={editor.isActive("italic") ? activeButtonStyles : toolbarButtonStyles}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          style={editor.isActive("underline") ? activeButtonStyles : toolbarButtonStyles}
        >
          U
        </button>

        <span style={separatorStyles} />

        {/* Heading buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          style={
            editor.isActive("heading", { level: 1 })
              ? activeButtonStyles
              : toolbarButtonStyles
          }
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          style={
            editor.isActive("heading", { level: 2 })
              ? activeButtonStyles
              : toolbarButtonStyles
          }
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          style={
            editor.isActive("heading", { level: 3 })
              ? activeButtonStyles
              : toolbarButtonStyles
          }
        >
          H3
        </button>

        <span style={separatorStyles} />

        {/* Alignment buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          style={
            editor.isActive({ textAlign: "left" })
              ? activeButtonStyles
              : toolbarButtonStyles
          }
        >
          {t("editor.left")}
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          style={
            editor.isActive({ textAlign: "center" })
              ? activeButtonStyles
              : toolbarButtonStyles
          }
        >
          {t("editor.center")}
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          style={
            editor.isActive({ textAlign: "right" })
              ? activeButtonStyles
              : toolbarButtonStyles
          }
        >
          {t("editor.right")}
        </button>

        <span style={separatorStyles} />

        {/* Screenplay format buttons */}
        {BLOCK_TYPES.map((blockType) => (
          <button
            key={blockType.name}
            type="button"
            title={`${t(blockType.i18nKey)} (${blockType.shortcut})`}
            onClick={() => {
              const command = blockTypeCommands[blockType.name];
              if (command) {
                command(editor);
              }
            }}
            style={
              editor.isActive(blockType.name)
                ? screenplayActiveButtonStyles
                : screenplayButtonStyles
            }
          >
            {t(blockType.i18nKey)}
          </button>
        ))}
      </div>

      <div style={contentStyles}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
