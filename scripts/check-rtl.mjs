// Fails when code uses physical (left/right) spacing or alignment instead of
// logical (start/end) equivalents, which break the Arabic RTL layout.
// Usage: npm run lint:rtl
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const srcDir = join(root, "src");

// Tailwind utilities with a logical replacement (ml → ms, pr → pe, left → start, …).
const physicalUtility =
  /^(?:-?)(?:m[lr]|p[lr]|scroll-[mp][lr]|left|right|border-[lr]|rounded-[lr]|rounded-[tb][lr])-|^(?:text|float|clear)-(?:left|right)$/;

// CSS properties/values with a logical replacement.
const physicalCss =
  /\b(?:margin|padding|border)-(?:left|right)\b|(?:^|[\s;{])(?:left|right)\s*:|text-align:\s*(?:left|right)|float:\s*(?:left|right)/;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

const problems = [];

for (const file of walk(srcDir)) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    if (line.includes("rtl-ok")) return;
    const where = `${relative(root, file)}:${index + 1}`;

    if (/\.(tsx|ts)$/.test(file)) {
      for (const [, literal] of line.matchAll(/"([^"]*)"|`([^`]*)`/g)) {
        for (const token of (literal ?? "").split(/\s+/)) {
          const utility = token.split(":").pop();
          if (utility && physicalUtility.test(utility)) problems.push(`${where}  ${token}`);
        }
      }
    } else if (file.endsWith(".css") && physicalCss.test(line)) {
      problems.push(`${where}  ${line.trim()}`);
    }
  });
}

if (problems.length > 0) {
  console.error("Physical direction styles found (use start/end, ms/me, ps/pe instead):\n");
  for (const problem of problems) console.error(`  ${problem}`);
  console.error("\nAdd an `rtl-ok` comment on the line if it is intentional.");
  process.exit(1);
}

console.log("RTL check passed: no physical left/right styles.");
