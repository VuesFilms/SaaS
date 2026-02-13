import { Node, mergeAttributes } from "@tiptap/core";
import { textblockTypeInputRule } from "@tiptap/core";

export interface CharacterOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    character: {
      /**
       * Set a character node
       */
      setCharacter: () => ReturnType;
    };
  }
}

/**
 * Matches lines starting with "@" for character names.
 * Example: "@JOHN" becomes a character block.
 */
const characterInputRegex = /^@\s$/;

export const Character = Node.create<CharacterOptions>({
  name: "character",

  group: "block",

  content: "text*",

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="character"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "character",
        style:
          "text-transform: uppercase; text-align: center; font-weight: bold; margin: 1em 0 0;",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setCharacter:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
    };
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: characterInputRegex,
        type: this.type,
      }),
    ];
  },
});

export default Character;
