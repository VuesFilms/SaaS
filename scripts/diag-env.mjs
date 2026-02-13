#!/usr/bin/env node

/**
 * diag-env.mjs - Environment variable diagnostic.
 *
 * Reads .env.example to discover expected environment variables, then checks
 * which ones are actually set in the current process environment.
 * Prints a status table showing missing vs set variables.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Parse .env.example to extract expected variable names
// ---------------------------------------------------------------------------

/**
 * Reads the .env.example file and returns an array of { name, defaultValue }
 * for every non-comment, non-empty line that contains a `KEY=VALUE` pair.
 */
function parseEnvExample(filePath) {
  let content;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch {
    console.error(`Could not read ${filePath}`);
    process.exit(1);
  }

  const vars = [];
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;
    const name = line.slice(0, eqIndex).trim();
    const defaultValue = line.slice(eqIndex + 1).trim();
    vars.push({ name, defaultValue });
  }
  return vars;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const envExamplePath = resolve(ROOT, ".env.example");
const expectedVars = parseEnvExample(envExamplePath);

if (expectedVars.length === 0) {
  console.log("No variables found in .env.example");
  process.exit(0);
}

// Determine column widths
const nameWidth = Math.max(
  "Variable".length,
  ...expectedVars.map((v) => v.name.length),
);
const statusWidth = 10;
const valueWidth = 30;

function pad(str, width) {
  return str + " ".repeat(Math.max(0, width - str.length));
}

function truncate(str, width) {
  if (str.length <= width) return str;
  return str.slice(0, width - 3) + "...";
}

// Header
console.log("");
console.log("Environment Variable Diagnostic");
console.log("=".repeat(nameWidth + statusWidth + valueWidth + 8));
console.log(
  `  ${pad("Variable", nameWidth)}  ${pad("Status", statusWidth)}  ${pad("Value / Default", valueWidth)}`,
);
console.log("-".repeat(nameWidth + statusWidth + valueWidth + 8));

let setCount = 0;
let missingCount = 0;

for (const { name, defaultValue } of expectedVars) {
  const envValue = process.env[name];
  const isSet = envValue !== undefined;

  if (isSet) {
    setCount++;
    const display = name.toLowerCase().includes("secret") ||
      name.toLowerCase().includes("password") ||
      name.toLowerCase().includes("key")
      ? "****"
      : truncate(envValue, valueWidth);
    console.log(
      `  ${pad(name, nameWidth)}  ${pad("SET", statusWidth)}  ${display}`,
    );
  } else {
    missingCount++;
    const display = defaultValue
      ? `(default: ${truncate(defaultValue, valueWidth - 11)})`
      : "(no default)";
    console.log(
      `  ${pad(name, nameWidth)}  ${pad("MISSING", statusWidth)}  ${display}`,
    );
  }
}

console.log("-".repeat(nameWidth + statusWidth + valueWidth + 8));
console.log(
  `  Total: ${expectedVars.length}  |  Set: ${setCount}  |  Missing: ${missingCount}`,
);
console.log("");

if (missingCount > 0) {
  console.log(
    `Tip: Copy .env.example to .env and fill in the missing values.`,
  );
  console.log("");
}
