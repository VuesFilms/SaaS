import type { Editor } from "@tiptap/core";

/**
 * Insert a new line with the given block type and focus it.
 */
function insertBlock(editor: Editor, nodeType: string): boolean {
  return editor
    .chain()
    .focus()
    .command(({ tr, dispatch }) => {
      if (dispatch) {
        const { $to } = tr.selection;
        const endOfBlock = $to.end();
        tr.split(endOfBlock);
      }
      return true;
    })
    .setNode(nodeType)
    .run();
}

export function setSceneHeading(editor: Editor): boolean {
  return insertBlock(editor, "sceneHeading");
}

export function setAction(editor: Editor): boolean {
  return insertBlock(editor, "action");
}

export function setCharacter(editor: Editor): boolean {
  return insertBlock(editor, "character");
}

export function setDialogue(editor: Editor): boolean {
  return insertBlock(editor, "dialogue");
}

export function setParenthetical(editor: Editor): boolean {
  return insertBlock(editor, "parenthetical");
}

export function setTransition(editor: Editor): boolean {
  return insertBlock(editor, "transition");
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
