// Copies the page and its vendored libraries into dist/ under the path it is
// served from on justinalick.com, and writes the security headers. The
// inline scripts are allowed by hash, so the CSP is recomputed on every build.
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const BASE = "/projects/guinea-pig-calculator";
const out = `dist${BASE}`;

rmSync("dist", { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of ["index.html", "LICENSE", "NOTICE"]) cpSync(f, `${out}/${f}`);
cpSync("vendor", `${out}/vendor`, { recursive: true });

const html = readFileSync("index.html", "utf8");
const hashes = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)]
  .map(m => `'sha256-${createHash("sha256").update(m[1]).digest("base64")}'`);
if (hashes.length === 0) throw new Error("no inline scripts found");

const csp = [
  "default-src 'self'",
  `script-src 'self' ${hashes.join(" ")}`,
  // KaTeX and the charts set inline style attributes.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // The Monte Carlo runs in Web Workers built from the page's own #sim script.
  "worker-src blob:",
  "connect-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

writeFileSync("dist/_headers", `${BASE}/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: DENY
  X-Robots-Tag: noindex

${BASE}/vendor/*
  Cache-Control: public, max-age=86400
`);
console.log(`built ${out} with ${hashes.length} inline script hashes`);
