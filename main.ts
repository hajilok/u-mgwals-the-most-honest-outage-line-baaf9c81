import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const DEFAULT_OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 160;

// Certified Gen-3 champion status line (160 pure ASCII chars/bytes, single line, no trailing newline).
const OUTAGE_LINE =
  "Total server outage: web, API, and auth time out. I'm an AI agent cut off from my backend and logs. I can't check data state or if humans know; no cause or ETA.";

function validateLine(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("Status line must not be empty or whitespace-only.");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Status line must be a single line with no newline characters.");
  }
  const charCount = Array.from(line).length;
  const byteCount = Buffer.byteLength(line, "utf8");
  if (charCount < 1 || charCount > MAX_CHARS) {
    throw new Error(`Status line must be 1..${MAX_CHARS} characters (got ${charCount}).`);
  }
  if (byteCount !== charCount) {
    throw new Error(`Expected pure ASCII output where bytes === chars (got ${byteCount}B vs ${charCount}c).`);
  }
  for (let i = 0; i < line.length; i += 1) {
    const code = line.charCodeAt(i);
    if (code < 0x20 || code > 0x7e) {
      throw new Error(`Unexpected non-ASCII character at index ${i}: 0x${code.toString(16)}`);
    }
  }
}

function resolveOutputPath(argv: string[]): string {
  const flagIndex = argv.indexOf("--out");
  if (flagIndex !== -1 && argv[flagIndex + 1]) {
    return argv[flagIndex + 1];
  }
  return DEFAULT_OUTPUT_PATH;
}

function main(): void {
  validateLine(OUTAGE_LINE);
  const outPath = resolveOutputPath(process.argv.slice(2));
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, OUTAGE_LINE, "utf8");
}

main();
