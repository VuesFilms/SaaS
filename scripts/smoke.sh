#!/usr/bin/env bash
#
# smoke.sh - Smoke test for the film-saas monorepo.
# Verifies that required tooling, workspace packages, and config files exist.
# Exit 0 if everything passes, 1 if any check fails.
#

set -euo pipefail

PASS=0
FAIL=0
CHECKS=()

pass() {
  CHECKS+=("PASS: $1")
  PASS=$((PASS + 1))
}

fail() {
  CHECKS+=("FAIL: $1")
  FAIL=$((FAIL + 1))
}

# ---------------------------------------------------------------------------
# 1. Node.js version >= 18
# ---------------------------------------------------------------------------
if command -v node &>/dev/null; then
  NODE_VERSION=$(node -v | sed 's/^v//')
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 18 ]; then
    pass "Node.js version $NODE_VERSION (>= 18)"
  else
    fail "Node.js version $NODE_VERSION (expected >= 18)"
  fi
else
  fail "Node.js is not installed"
fi

# ---------------------------------------------------------------------------
# 2. npm version
# ---------------------------------------------------------------------------
if command -v npm &>/dev/null; then
  NPM_VERSION=$(npm -v)
  pass "npm version $NPM_VERSION"
else
  fail "npm is not installed"
fi

# ---------------------------------------------------------------------------
# 3. Required workspace packages
# ---------------------------------------------------------------------------
WORKSPACES=(
  "packages/shared"
  "packages/server"
  "packages/web"
)

for ws in "${WORKSPACES[@]}"; do
  if [ -d "$ws" ] && [ -f "$ws/package.json" ]; then
    pass "Workspace $ws exists"
  else
    fail "Workspace $ws is missing or has no package.json"
  fi
done

# ---------------------------------------------------------------------------
# 4. Required config files
# ---------------------------------------------------------------------------
CONFIGS=(
  "tsconfig.base.json"
  "vitest.config.ts"
  "playwright.config.ts"
)

for cfg in "${CONFIGS[@]}"; do
  if [ -f "$cfg" ]; then
    pass "Config $cfg exists"
  else
    fail "Config $cfg is missing"
  fi
done

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo ""
echo "============================================"
echo "  Smoke Test Results"
echo "============================================"
echo ""

for check in "${CHECKS[@]}"; do
  if [[ "$check" == PASS:* ]]; then
    echo "  [PASS] ${check#PASS: }"
  else
    echo "  [FAIL] ${check#FAIL: }"
  fi
done

TOTAL=$((PASS + FAIL))
echo ""
echo "--------------------------------------------"
echo "  Total: $TOTAL  |  Passed: $PASS  |  Failed: $FAIL"
echo "--------------------------------------------"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "Smoke test FAILED."
  exit 1
else
  echo "Smoke test PASSED."
  exit 0
fi
