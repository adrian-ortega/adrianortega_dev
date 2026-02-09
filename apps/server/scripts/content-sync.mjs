#!/usr/bin/env node
/**
 * content-sync.mjs
 *
 * Pulls a content repo to a local folder for development.
 *
 * Env vars:
 *   CONTENT_REPO         (required) e.g. git@github.com:org/content.git or https://...
 *   CONTENT_BRANCH       (optional) default: main
 *   CONTENT_DIR          (optional) default: .content
 *   CONTENT_SPARSE_PATHS (optional) comma-separated paths, e.g. "content,assets"
 *
 * Examples:
 *   CONTENT_REPO=git@github.com:org/site-content.git node scripts/content-sync.mjs
 *   CONTENT_REPO=... CONTENT_BRANCH=develop CONTENT_SPARSE_PATHS=content,assets node scripts/content-sync.mjs
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repo = process.env.CONTENT_REPO;
const branch = process.env.CONTENT_BRANCH || "master";
const dir = process.env.CONTENT_DIR || "./content";
const cache = process.env.CONTENT_CACHE_DIR || "./data";
const sparsePathsRaw = process.env.CONTENT_SPARSE_PATHS || "";
const sparsePaths = sparsePathsRaw
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (!repo) {
  console.error(
    `[content:sync] Missing CONTENT_REPO. Example:\n` +
      `  CONTENT_REPO=git@github.com:org/site-content.git yarn content:sync`
  );
  process.exit(1);
}

const absDir = path.resolve(process.cwd(), dir);
const gitDir = path.join(absDir, ".git");
const cacheDir = path.resolve(process.cwd(), cache);
const isRepo = fs.existsSync(gitDir);

function runGit(args, opts = {}) {
  const finalOpts = {
    stdio: "inherit",
    ...opts,
  };
  execFileSync("git", args, finalOpts);
}

function ensureDirExists(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function syncSparseCheckout() {
  // Configure sparse checkout if requested.
  // This is safe to run repeatedly.
  if (sparsePaths.length === 0) return;

  console.log(`[content:sync] Enabling sparse-checkout: ${sparsePaths.join(", ")}`);

  runGit(["-C", absDir, "config", "core.sparseCheckout", "true"]);
  runGit(["-C", absDir, "sparse-checkout", "init", "--cone"]);

  // Set requested paths
  runGit(["-C", absDir, "sparse-checkout", "set", ...sparsePaths]);
}

function cloneFresh() {
  console.log(`[content:sync] Cloning ${repo} (${branch}) -> ${absDir}`);
  ensureDirExists(path.dirname(absDir));

  // Clone
  runGit(["clone", "--depth", "1", "--branch", branch, repo, absDir]);

  // Optional sparse checkout AFTER clone (git needs a working repo first)
  syncSparseCheckout();

  console.log("[content:sync] Clone complete.");
}

function updateExisting() {
  console.log(`[content:sync] Updating existing content repo in ${absDir}`);

  // Fetch the branch we care about
  runGit(["-C", absDir, "fetch", "origin", branch, "--depth", "1"]);

  // Hard reset to remote branch
  runGit(["-C", absDir, "reset", "--hard", `origin/${branch}`]);

  // Clean untracked files (important for deterministic builds)
  runGit(["-C", absDir, "clean", "-fdx"]);

  // Re-apply sparse settings if requested (and ensure they stay correct)
  syncSparseCheckout();

  console.log("[content:sync] Update complete.");
}

try {
  // Check if cache dir exists, and remove it
  if (fs.existsSync(cacheDir)) {
    console.log(`[content:sync] ${cacheDir} exists. Removing it...`);
    fs.rmSync(cacheDir, { recursive: true, force: true });
  }
  if (!isRepo) {
    // If dir exists but isn't a repo, delete it to avoid weirdness
    if (fs.existsSync(absDir)) {
      console.log(`[content:sync] ${absDir} exists but is not a git repo. Removing it...`);
      fs.rmSync(absDir, { recursive: true, force: true });
    }
    cloneFresh();
  } else {
    updateExisting();
  }
} catch (err) {
  console.error("[content:sync] Failed:", err?.message || err);
  process.exit(1);
}
