import { Node, mergeAttributes } from "@tiptap/core";

export interface DialogueOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    dialogue: {
      /**
       * Set a dialogue node
       */
      setDialogue: () => ReturnType;
    };
  }
}

export const Dialogue = Node.create<DialogueOptions>({
  name: "dialogue",

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
        tag: 'div[data-type="dialogue"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "dialogue",
        style:
          "text-align: center; margin: 0 15% 0.5em 15%; padding: 0 10%;",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setDialogue:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
    };
  },
});

export default Dialogue;
