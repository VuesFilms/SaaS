import type { Editor } from "@tiptap/core";

/**
 * Set the current block to a scene heading node.
 */
export function setSceneHeading(editor: Editor): boolean {
  return editor.chain().focus().setNode("sceneHeading").run();
}

/**
 * Set the current block to an action node.
 */
export function setAction(editor: Editor): boolean {
  return editor.chain().focus().setNode("action").run();
}

/**
 * Set the current block to a character node.
 */
export function setCharacter(editor: Editor): boolean {
  return editor.chain().focus().setNode("character").run();
}

/**
 * Set the current block to a dialogue node.
 */
export function setDialogue(editor: Editor): boolean {
  return editor.chain().focus().setNode("dialogue").run();
}

/**
 * Set the current block to a parenthetical node.
 */
export function setParenthetical(editor: Editor): boolean {
  return editor.chain().focus().setNode("parenthetical").run();
}

/**
 * Set the current block to a transition node.
 */
export function setTransition(editor: Editor): boolean {
  return editor.chain().focus().setNode("transition").run();
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
