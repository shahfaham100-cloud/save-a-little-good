// Builds a self-contained Node.js server for Hostinger into ./hostinger-upload
// Usage: npm install && npm run build:hostinger
import { execSync } from "node:child_process";
import { cpSync, existsSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, ".output");
const uploadDir = join(root, "hostinger-upload");

rmSync(outDir, { recursive: true, force: true });
rmSync(uploadDir, { recursive: true, force: true });

console.log("Building for Node.js (Hostinger)...");
execSync("npx vite build", {
  stdio: "inherit",
  env: { ...process.env, NITRO_PRESET: "node-server", NODE_ENV: "production" },
});

const entry = join(outDir, "server", "index.mjs");
if (!existsSync(entry)) {
  console.error("Build failed: .output/server/index.mjs not found.");
  process.exit(1);
}

cpSync(outDir, uploadDir, { recursive: true });

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
writeFileSync(
  join(uploadDir, "package.json"),
  JSON.stringify(
    {
      name: "save-me-save-you",
      version: pkg.version ?? "1.0.0",
      private: true,
      type: "module",
      main: "server/index.mjs",
      scripts: { start: "node server/index.mjs" },
      engines: { node: ">=20" },
    },
    null,
    2,
  ) + "\n",
);

// Root-level entry file for panels that expect server.js / index.js
writeFileSync(join(uploadDir, "server.js"), 'import "./server/index.mjs";\n');

console.log("\nDone. Zip the CONTENTS of ./hostinger-upload and upload to Hostinger.");
console.log("Entry file: server.js   Start command: npm start");
