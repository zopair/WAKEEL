import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../prototype/index.html", import.meta.url), "utf8");
const sw = readFileSync(new URL("../prototype/sw.js", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../prototype/manifest.webmanifest", import.meta.url), "utf8"));

test("prototype includes Arabic RTL and English language switching", () => {
  assert.match(html, /dir\s*=\s*["']rtl["']/);
  assert.match(html, /localStorage\.setItem\(['"]wk-lang['"]/);
  assert.match(html, /language:'English'/);
});

test("prototype has animated Egyptian flag and mobile-first layout", () => {
  assert.match(html, /@keyframes\s+wave/);
  assert.match(html, /\.flag/);
  assert.match(html, /@media\s*\(max-width:\s*680px\)/);
  assert.match(html, /prefers-reduced-motion/);
});

test("prototype simulates demand matching, deal states and commissions", () => {
  for (const token of ["data-match", "matching", "quoted", "confirmed", "shipped", "complete", "0.005", "0.001", "0.006"]) {
    assert.ok(html.includes(token), `Missing workflow token: ${token}`);
  }
});

test("Lite PWA has a scoped offline app-shell cache and standalone manifest", () => {
  assert.match(sw, /caches\.open\(CACHE\)/);
  assert.match(sw, /self\.addEventListener\(["']fetch["']/);
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.scope, "./");
});

test("prototype has no remote runtime dependencies", () => {
  assert.doesNotMatch(html, /https?:\/\//);
});