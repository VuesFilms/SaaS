import type { Editor } from "@tiptap/core";
import type { Node as ProsemirrorNode } from "@tiptap/pm/model";
import { jsPDF } from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";

/**
 * Export the editor content as a PDF file download.
 */
export function exportPDF(editor: Editor, filename = "script.pdf") {
  const json = editor.getJSON();
  const doc = new jsPDF({ unit: "in", format: "letter" });

  const marginLeft = 1.5;
  const marginRight = 1;
  const marginTop = 1;
  const marginBottom = 1;
  const pageWidth = 8.5;
  const usableWidth = pageWidth - marginLeft - marginRight;
  const pageHeight = 11;
  let y = marginTop;

  doc.setFont("courier", "normal");

  for (const node of json.content ?? []) {
    const text = extractText(node);
    if (!text && node.type !== "paragraph") continue;

    let fontSize = 12;
    let fontStyle: "normal" | "bold" = "normal";
    let xOffset = marginLeft;
    let lineSpacing = 0.2;
    let beforeSpacing = 0;
    let maxWidth = usableWidth;

    switch (node.type) {
      case "sceneHeading":
        fontStyle = "bold";
        beforeSpacing = 0.3;
        break;
      case "action":
        beforeSpacing = 0.15;
        break;
      case "character":
        xOffset = 3.7;
        maxWidth = 3;
        beforeSpacing = 0.3;
        break;
      case "dialogue":
        xOffset = 2.5;
        maxWidth = 3.5;
        break;
      case "parenthetical":
        xOffset = 3.1;
        maxWidth = 2.5;
        break;
      case "transition":
        xOffset = 5.5;
        maxWidth = 2;
        beforeSpacing = 0.3;
        break;
      case "heading": {
        const level = (node.attrs?.level as number) ?? 1;
        fontSize = level === 1 ? 18 : level === 2 ? 15 : 13;
        fontStyle = "bold";
        beforeSpacing = 0.4;
        break;
      }
      default:
        break;
    }

    y += beforeSpacing;

    if (y > pageHeight - marginBottom - 0.5) {
      doc.addPage();
      y = marginTop;
    }

    doc.setFontSize(fontSize);
    doc.setFont("courier", fontStyle);

    const displayText =
      node.type === "sceneHeading" || node.type === "transition"
        ? text.toUpperCase()
        : node.type === "parenthetical"
          ? `(${text})`
          : text;

    const lines = doc.splitTextToSize(displayText, maxWidth);

    for (const line of lines) {
      if (y > pageHeight - marginBottom) {
        doc.addPage();
        y = marginTop;
      }
      doc.text(line, xOffset, y);
      y += lineSpacing;
    }

    y += 0.05;
  }

  doc.save(filename);
}

/**
 * Export the editor content as a Word (.docx) file download.
 */
export async function exportWord(editor: Editor, filename = "script.docx") {
  const json = editor.getJSON();
  const paragraphs: Paragraph[] = [];

  for (const node of json.content ?? []) {
    const text = extractText(node);

    switch (node.type) {
      case "sceneHeading":
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: text.toUpperCase(),
                bold: true,
                font: "Courier New",
                size: 24,
              }),
            ],
            spacing: { before: 240, after: 120 },
          }),
        );
        break;

      case "action":
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text, font: "Courier New", size: 24 }),
            ],
            spacing: { before: 120, after: 120 },
          }),
        );
        break;

      case "character":
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: text.toUpperCase(),
                bold: true,
                font: "Courier New",
                size: 24,
              }),
            ],
            spacing: { before: 240, after: 0 },
            indent: { left: 2880 },
          }),
        );
        break;

      case "dialogue":
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text, font: "Courier New", size: 24 }),
            ],
            spacing: { before: 0, after: 120 },
            indent: { left: 1440, right: 1440 },
          }),
        );
        break;

      case "parenthetical":
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `(${text})`,
                font: "Courier New",
                size: 24,
                italics: true,
              }),
            ],
            spacing: { before: 0, after: 0 },
            indent: { left: 2160, right: 2160 },
          }),
        );
        break;

      case "transition":
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: text.toUpperCase(),
                bold: true,
                font: "Courier New",
                size: 24,
              }),
            ],
            spacing: { before: 240, after: 240 },
          }),
        );
        break;

      case "heading": {
        const level = (node.attrs?.level as number) ?? 1;
        const headingLevel =
          level === 1
            ? HeadingLevel.HEADING_1
            : level === 2
              ? HeadingLevel.HEADING_2
              : HeadingLevel.HEADING_3;
        paragraphs.push(
          new Paragraph({
            heading: headingLevel,
            children: [
              new TextRun({
                text,
                bold: true,
                font: "Courier New",
                size: level === 1 ? 36 : level === 2 ? 30 : 26,
              }),
            ],
            spacing: { before: 360, after: 120 },
          }),
        );
        break;
      }

      default:
        if (text) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text, font: "Courier New", size: 24 }),
              ],
              spacing: { before: 60, after: 60 },
            }),
          );
        }
        break;
    }
  }

  const wordDoc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 2160 },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(wordDoc);
  saveAs(blob, filename);
}

/**
 * Import a Word (.docx), PDF, JSON, or TXT file into the editor.
 */
export function importFile(editor: Editor) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".docx,.pdf,.json,.txt";
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;

    if (file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string);
          editor.commands.setContent(json);
        } catch {
          // invalid JSON
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = () => {
        const json = parsePlainText(reader.result as string);
        editor.commands.setContent(json);
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".docx")) {
      importDocx(file, editor);
    } else if (file.name.endsWith(".pdf")) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = extractPDFText(reader.result as ArrayBuffer);
        if (text.trim()) {
          editor.commands.setContent(parsePlainText(text));
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };
  input.click();
}

async function importDocx(file: File, editor: Editor) {
  try {
    const buffer = await file.arrayBuffer();
    const text = await extractDocxText(buffer);
    editor.commands.setContent(parsePlainText(text));
  } catch {
    // Failed to parse docx
  }
}

async function extractDocxText(buffer: ArrayBuffer): Promise<string> {
  const uint8 = new Uint8Array(buffer);
  if (uint8[0] !== 0x50 || uint8[1] !== 0x4b) return "";

  const entries = await readZipEntries(buffer);
  const docEntry = entries.find(
    (e) => e.name === "word/document.xml" || e.name === "word\\document.xml",
  );
  if (!docEntry) return "";

  const xmlText = new TextDecoder().decode(docEntry.data);
  const paragraphs: string[] = [];
  const parts = xmlText.split(/<w:p[\s/>]/);

  for (const part of parts) {
    const textMatches = part.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
    const paraText = textMatches
      .map((m) => {
        const match = m.match(/<w:t[^>]*>([^<]*)<\/w:t>/);
        return match ? match[1] : "";
      })
      .join("");
    if (paraText.trim()) {
      paragraphs.push(paraText);
    }
  }

  return paragraphs.join("\n");
}

interface ZipEntry {
  name: string;
  data: Uint8Array;
}

async function readZipEntries(buffer: ArrayBuffer): Promise<ZipEntry[]> {
  const view = new DataView(buffer);
  const uint8 = new Uint8Array(buffer);
  const entries: ZipEntry[] = [];

  let eocdOffset = -1;
  for (let i = uint8.length - 22; i >= 0; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset === -1) return entries;

  const cdOffset = view.getUint32(eocdOffset + 16, true);
  const cdEntries = view.getUint16(eocdOffset + 10, true);

  let offset = cdOffset;
  for (let i = 0; i < cdEntries; i++) {
    if (offset + 46 > uint8.length) break;
    if (view.getUint32(offset, true) !== 0x02014b50) break;

    const compressedSize = view.getUint32(offset + 20, true);
    const uncompressedSize = view.getUint32(offset + 24, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localHeaderOffset = view.getUint32(offset + 42, true);
    const compressionMethod = view.getUint16(offset + 10, true);

    const name = new TextDecoder().decode(
      uint8.slice(offset + 46, offset + 46 + nameLength),
    );

    if (localHeaderOffset + 30 <= uint8.length) {
      const localNameLen = view.getUint16(localHeaderOffset + 26, true);
      const localExtraLen = view.getUint16(localHeaderOffset + 28, true);
      const dataStart = localHeaderOffset + 30 + localNameLen + localExtraLen;

      if (compressionMethod === 0) {
        entries.push({
          name,
          data: uint8.slice(dataStart, dataStart + uncompressedSize),
        });
      } else if (compressionMethod === 8) {
        try {
          const compressed = uint8.slice(dataStart, dataStart + compressedSize);
          const ds = new DecompressionStream("raw");
          const writer = ds.writable.getWriter();
          writer.write(compressed);
          writer.close();
          const streamReader = ds.readable.getReader();
          const chunks: Uint8Array[] = [];
          let done = false;
          while (!done) {
            const result = await streamReader.read();
            if (result.done) {
              done = true;
            } else {
              chunks.push(result.value);
            }
          }
          const totalLen = chunks.reduce((s, c) => s + c.length, 0);
          const decompressed = new Uint8Array(totalLen);
          let pos = 0;
          for (const chunk of chunks) {
            decompressed.set(chunk, pos);
            pos += chunk.length;
          }
          entries.push({ name, data: decompressed });
        } catch {
          // skip
        }
      }
    }

    offset += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

function extractPDFText(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const raw = new TextDecoder("latin1").decode(bytes);
  const parts: string[] = [];

  const btEt = /BT\s([\s\S]*?)ET/g;
  let m;
  while ((m = btEt.exec(raw)) !== null) {
    const block = m[1];
    const tj = /\(([^)]*)\)\s*Tj/g;
    let t;
    while ((t = tj.exec(block)) !== null) parts.push(t[1]);
    const tjArr = /\[([^\]]*)\]\s*TJ/g;
    let a;
    while ((a = tjArr.exec(block)) !== null) {
      const inner = a[1];
      const sp = /\(([^)]*)\)/g;
      let s;
      while ((s = sp.exec(inner)) !== null) parts.push(s[1]);
    }
  }

  return parts.join("\n");
}

function parsePlainText(
  text: string,
): { type: string; content: Record<string, unknown>[] } {
  const lines = text.split("\n");
  const content: Record<string, unknown>[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trimEnd();

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (/^(INT\.|EXT\.|INT\.\/EXT\.)/i.test(line)) {
      content.push(textNode("sceneHeading", line));
      i++;
      continue;
    }

    if (/^[A-Z\s]+TO:$/.test(line.trim())) {
      content.push(textNode("transition", line.trim()));
      i++;
      continue;
    }

    if (/^\(.*\)$/.test(line.trim())) {
      content.push(textNode("parenthetical", line.trim().slice(1, -1)));
      i++;
      continue;
    }

    if (/^[A-Z][A-Z\s.'-]{1,}$/.test(line.trim()) && line.trim().length >= 2) {
      content.push(textNode("character", line.trim()));
      i++;
      while (i < lines.length) {
        const nextLine = lines[i].trimEnd();
        if (nextLine.trim() === "") break;
        if (/^\(.*\)$/.test(nextLine.trim())) {
          content.push(textNode("parenthetical", nextLine.trim().slice(1, -1)));
        } else {
          content.push(textNode("dialogue", nextLine.trim()));
        }
        i++;
      }
      continue;
    }

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
