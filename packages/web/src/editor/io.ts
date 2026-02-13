import type { Editor } from "@tiptap/core";
import type { Node as ProsemirrorNode } from "@tiptap/pm/model";

/**
 * Export the editor content as a JSON file download.
 */
export function exportJSON(editor: Editor, filename = "script.json") {
  const json = editor.getJSON();
  const blob = new Blob([JSON.stringify(json, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, filename);
}

/**
 * Export the editor content as a Fountain (.fountain) file download.
 * Fountain is the standard plain-text screenplay format.
 */
export function exportFountain(editor: Editor, filename = "script.fountain") {
  const json = editor.getJSON();
  const lines: string[] = [];

  for (const node of json.content ?? []) {
    const text = extractText(node);

    switch (node.type) {
      case "sceneHeading":
        lines.push("");
        lines.push(text.toUpperCase());
        lines.push("");
        break;
      case "action":
        lines.push(text);
        lines.push("");
        break;
      case "character":
        lines.push("");
        lines.push(text.toUpperCase());
        break;
      case "dialogue":
        lines.push(text);
        lines.push("");
        break;
      case "parenthetical":
        lines.push(`(${text})`);
        break;
      case "transition":
        lines.push("");
        lines.push(`> ${text.toUpperCase()}`);
        lines.push("");
        break;
      case "heading": {
        const level = node.attrs?.level ?? 1;
        lines.push("");
        lines.push(`${"#".repeat(level)} ${text}`);
        lines.push("");
        break;
      }
      default:
        lines.push(text);
        lines.push("");
        break;
    }
  }

  const fountain = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  const blob = new Blob([fountain], { type: "text/plain" });
  downloadBlob(blob, filename);
}

/**
 * Import a JSON or Fountain file into the editor.
 */
export function importFile(editor: Editor) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,.fountain,.txt";
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;

      if (file.name.endsWith(".json")) {
        try {
          const json = JSON.parse(content);
          editor.commands.setContent(json);
        } catch {
          // invalid JSON - ignore
        }
      } else {
        const json = parseFountain(content);
        editor.commands.setContent(json);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

/**
 * Parse Fountain plain text into TipTap JSON structure.
 */
function parseFountain(
  text: string,
): { type: string; content: Record<string, unknown>[] } {
  const lines = text.split("\n");
  const content: Record<string, unknown>[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trimEnd();

    // Skip blank lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Scene headings: INT. / EXT. / INT./EXT.
    if (/^(INT\.|EXT\.|INT\.\/EXT\.)/i.test(line)) {
      content.push(textNode("sceneHeading", line));
      i++;
      continue;
    }

    // Transitions: > TEXT or lines ending with TO:
    if (line.startsWith("> ") || /^[A-Z\s]+TO:$/.test(line.trim())) {
      const transitionText = line.startsWith("> ") ? line.slice(2) : line;
      content.push(textNode("transition", transitionText.trim()));
      i++;
      continue;
    }

    // Parenthetical: (text)
    if (/^\(.*\)$/.test(line.trim())) {
      const parenText = line.trim().slice(1, -1);
      content.push(textNode("parenthetical", parenText));
      i++;
      continue;
    }

    // Character: ALL CAPS line (at least 2 chars, followed by dialogue)
    if (
      /^[A-Z][A-Z\s.'-]{1,}$/.test(line.trim()) &&
      !line.startsWith("> ")
    ) {
      content.push(textNode("character", line.trim()));
      i++;
      // Collect following dialogue/parenthetical
      while (i < lines.length) {
        const nextLine = lines[i].trimEnd();
        if (nextLine.trim() === "") break;
        if (/^\(.*\)$/.test(nextLine.trim())) {
          content.push(
            textNode("parenthetical", nextLine.trim().slice(1, -1)),
          );
        } else {
          content.push(textNode("dialogue", nextLine.trim()));
        }
        i++;
      }
      continue;
    }

    // Headings: # Title
    const headingMatch = line.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      content.push({
        type: "heading",
        attrs: { level: headingMatch[1].length },
        content: [{ type: "text", text: headingMatch[2] }],
      });
      i++;
      continue;
    }

    // Default: action
    content.push(textNode("action", line));
    i++;
  }

  return { type: "doc", content };
}

function textNode(
  type: string,
  text: string,
): { type: string; content?: { type: string; text: string }[] } {
  if (!text) return { type };
  return { type, content: [{ type: "text", text }] };
}

function extractText(node: Record<string, unknown>): string {
  const content = node.content as ProsemirrorNode[] | undefined;
  if (!content) return "";
  return content.map((c: Record<string, unknown>) => c.text ?? "").join("");
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
