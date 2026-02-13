import { Node, mergeAttributes, InputRule } from "@tiptap/core";

export interface TransitionOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    transition: {
      /**
       * Set a transition node
       */
      setTransition: () => ReturnType;
    };
  }
}

/**
 * Matches lines ending with "TO:" for transitions.
 * Examples: "CUT TO:", "DISSOLVE TO:", "SMASH CUT TO:"
 */
const transitionInputRegex = /^(.+TO:)\s$/;

export const Transition = Node.create<TransitionOptions>({
  name: "transition",

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
        tag: 'div[data-type="transition"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "transition",
        style:
          "text-transform: uppercase; text-align: right; font-weight: bold; margin: 1em 0;",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setTransition:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
    };
  },

  addInputRules() {
    return [
      new InputRule({
        find: transitionInputRegex,
        handler: ({ state, range, match }) => {
          const { tr } = state;
          const start = range.from;
          const end = range.to;

          const nodeType = this.type;

          // Delete the matched text and replace with the transition node
          tr.delete(start, end);

          // Set the block type to transition
          const blockRange = tr.doc.resolve(start).blockRange();
          if (blockRange) {
            tr.setBlockType(blockRange.start, blockRange.end, nodeType);
          }

          // Re-insert the matched content (the text before "TO: ")
          if (match[1]) {
            tr.insertText(match[1], start);
          }
        },
      }),
    ];
  },
});

export default Transition;
