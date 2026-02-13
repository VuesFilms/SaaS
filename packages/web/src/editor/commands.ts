import type { Editor } from "@tiptap/core";

/**
 * Convert the current block to the given block type (in-place).
 */
function setBlock(editor: Editor, nodeType: string): boolean {
  return editor.chain().focus().setNode(nodeType).run();
}

export function setSceneHeading(editor: Editor): boolean {
  return setBlock(editor, "sceneHeading");
}

export function setAction(editor: Editor): boolean {
  return setBlock(editor, "action");
}

export function setCharacter(editor: Editor): boolean {
  return setBlock(editor, "character");
}

export function setDialogue(editor: Editor): boolean {
  return setBlock(editor, "dialogue");
}

export function setParenthetical(editor: Editor): boolean {
  return setBlock(editor, "parenthetical");
}

export function setTransition(editor: Editor): boolean {
  return setBlock(editor, "transition");
}

export interface BlockType {
  name: string;
  i18nKey: string;
  shortcut: string;
}

/**
 * Array of screenplay block types for toolbar rendering.
 */
export const BLOCK_TYPES: BlockType[] = [
  { name: "sceneHeading", i18nKey: "editor.sceneHeading", shortcut: "Ctrl+1" },
  { name: "action", i18nKey: "editor.action", shortcut: "Ctrl+2" },
  { name: "character", i18nKey: "editor.character", shortcut: "Ctrl+3" },
  { name: "dialogue", i18nKey: "editor.dialogue", shortcut: "Ctrl+4" },
  { name: "parenthetical", i18nKey: "editor.parenthetical", shortcut: "Ctrl+5" },
  { name: "transition", i18nKey: "editor.transition", shortcut: "Ctrl+6" },
];
