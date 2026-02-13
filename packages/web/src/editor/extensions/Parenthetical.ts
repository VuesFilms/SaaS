import { Node, mergeAttributes } from "@tiptap/core";
import { textblockTypeInputRule } from "@tiptap/core";

export interface ParentheticalOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    parenthetical: {
      /**
       * Set a parenthetical node
       */
      setParenthetical: () => ReturnType;
    };
  }
}

/**
 * Matches lines starting with "(" for parentheticals.
 * Example: "(whispering)" becomes a parenthetical block.
 */
const parentheticalInputRegex = /^\(\s$/;

export const Parenthetical = Node.create<ParentheticalOptions>({
  name: "parenthetical",

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
        tag: 'div[data-type="parenthetical"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "parenthetical",
        style:
          "text-align: center; margin: 0 20%; font-style: italic;",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setParenthetical:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
    };
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: parentheticalInputRegex,
        type: this.type,
      }),
    ];
  },
});

export default Parenthetical;
