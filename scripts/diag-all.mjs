#!/usr/bin/env node

/**
 * diag-all.mjs - Full diagnostic for the film-saas monorepo.
 *
 * Checks:
 *   1. Node.js version
 *   2. npm version
 *   3. Docker availability
 *   4. docker-compose services (postgres, redis, minio)
 *   5. Environment variable diagnostic (delegates to diag-env.mjs)
 *   6. Overall health status
 */

import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const results = [];

function check(label, fn) {
  try {
    const detail = fn();
    results.push({ label, status: "OK", detail });
  } catch (err) {
    results.push({ label, status: "FAIL", detail: err.message || String(err) });
  }
}

function run(cmd) {
  return execSync(cmd, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

// 1. Node.js version
check("Node.js version", () => {
  const version = process.version;
  const major = parseInt(version.slice(1).split(".")[0], 10);
  if (major < 18) {
    throw new Error(`${version} (expected >= 18)`);
  }
  return version;
});

// 2. npm version
check("npm version", () => {
  return run("npm -v");
});

// 3. Docker availability
check("Docker available", () => {
  return run("docker --version");
});

// 4. docker-compose services
const EXPECTED_SERVICES = ["postgres", "redis", "minio"];

check("docker-compose services", () => {
  // Try both `docker compose` (v2) and `docker-compose` (v1)
  let output;
  try {
    output = run(`docker compose -f ${resolve(ROOT, "docker-compose.yml")} ps --format json 2>/dev/null || docker compose -f ${resolve(ROOT, "docker-compose.yml")} ps`);
  } catch {
    try {
      output = run(`docker-compose -f ${resolve(ROOT, "docker-compose.yml")} ps`);
    } catch {
      throw new Error("docker-compose is not available or not running");
    }
  }

  const running = [];
  const notRunning = [];

  for (const service of EXPECTED_SERVICES) {
    // Check if the service name appears in the output and looks to be running
    const serviceRegex = new RegExp(service, "i");
    if (serviceRegex.test(output)) {
      running.push(service);
    } else {
      notRunning.push(service);
    }
  }

  if (notRunning.length > 0) {
    throw new Error(
      `Running: [${running.join(", ")}] | Not found: [${notRunning.join(", ")}]`,
    );
  }

  return `All services running: ${running.join(", ")}`;
});

// 5. Environment variable diagnostic
check("Environment variables", () => {
  const diagEnvPath = resolve(__dirname, "diag-env.mjs");
  const output = run(`node ${diagEnvPath}`);
  // Count MISSING lines
  const missingCount = (output.match(/MISSING/g) || []).length;
  if (missingCount > 0) {
    throw new Error(`${missingCount} env var(s) not set. Run "npm run diag:env" for details.`);
  }
  return "All expected variables are set";
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log("");
console.log("============================================");
console.log("  Full Diagnostic Report");
console.log("============================================");
console.log("");

const labelWidth = Math.max(...results.map((r) => r.label.length));

function pad(str, width) {
  return str + " ".repeat(Math.max(0, width - str.length));
}

let failures = 0;

for (const { label, status, detail } of results) {
  const icon = status === "OK" ? "[OK]  " : "[FAIL]";
  if (status !== "OK") failures++;
  console.log(`  ${icon} ${pad(label, labelWidth)}  ${detail}`);
}

console.log("");
console.log("--------------------------------------------");

if (failures === 0) {
  console.log("  Overall health: HEALTHY");
} else {
  console.log(`  Overall health: DEGRADED (${failures} issue${failures > 1 ? "s" : ""} found)`);
}

console.log("--------------------------------------------");
console.log("");

process.exit(failures > 0 ? 1 : 0);
