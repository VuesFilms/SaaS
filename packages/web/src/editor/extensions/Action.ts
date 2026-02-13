import { Node, mergeAttributes } from "@tiptap/core";

export interface ActionOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    action: {
      /**
       * Set an action node
       */
      setAction: () => ReturnType;
    };
  }
}

export const Action = Node.create<ActionOptions>({
  name: "action",

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
        tag: 'div[data-type="action"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "action",
        style: "width: 100%; margin: 0.5em 0;",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setAction:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
    };
  },
});

export default Action;
