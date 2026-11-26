import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const DEFAULT_OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 160;

// Round-1 working draft prior to blind pairwise tournament selection.
const OUTAGE_LINE =
  "Total outage: all servers, web, and API are down. I am an AI status agent seeing only failed checks; I cannot read logs, reach humans, or verify cause or ETA.";

function validateLine(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("Status line must not be empty or whitespace-only.");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Status line must be a single line with no newline characters.");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(`Status line exceeds ${MAX_CHARS} characters (got ${line.length}).`);
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
