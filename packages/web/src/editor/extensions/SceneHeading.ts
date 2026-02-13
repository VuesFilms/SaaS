import { Node, mergeAttributes } from "@tiptap/core";
import { textblockTypeInputRule } from "@tiptap/core";

export interface SceneHeadingOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    sceneHeading: {
      /**
       * Set a scene heading node
       */
      setSceneHeading: () => ReturnType;
    };
  }
}

/**
 * Matches lines starting with INT. or EXT. or INT./EXT.
 * Examples: "INT. HOUSE", "EXT. PARK - DAY", "INT./EXT. CAR"
 */
const sceneHeadingInputRegex = /^(INT\.|EXT\.|INT\.\/EXT\.)\s$/;

export const SceneHeading = Node.create<SceneHeadingOptions>({
  name: "sceneHeading",

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
        tag: 'div[data-type="scene-heading"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "scene-heading",
        style:
          "text-transform: uppercase; font-weight: bold; margin: 1em 0 0.5em 0;",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setSceneHeading:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
    };
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: sceneHeadingInputRegex,
        type: this.type,
      }),
    ];
  },
});

export default SceneHeading;
