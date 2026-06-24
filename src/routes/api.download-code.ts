import { createFileRoute } from "@tanstack/react-router";
import JSZip from "jszip";
import fs from "fs";
import path from "path";

const EXCLUDED = new Set([
  "node_modules",
  ".git",
  ".lovable",
  ".tanstack",
  ".workspace",
  "dist",
  "build",
  ".gitignore",
  ".prettierignore",
  ".prettierrc",
  "bun.lock",
  "bunfig.toml",
  "AGENTS.md",
]);

async function addDirectoryToZip(zip: JSZip, dirPath: string, zipPrefix: string) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDED.has(entry.name)) continue;
    const fullPath = path.join(dirPath, entry.name);
    const zipPath = path.join(zipPrefix, entry.name);
    if (entry.isDirectory()) {
      await addDirectoryToZip(zip, fullPath, zipPath);
    } else {
      const content = fs.readFileSync(fullPath);
      zip.file(zipPath, content);
    }
  }
}

export const Route = createFileRoute("/api/download-code")({
  server: {
    handlers: {
      GET: async () => {
        const zip = new JSZip();
        const rootDir = process.cwd();
        await addDirectoryToZip(zip, rootDir, "");

        const buffer = await zip.generateAsync({ type: "nodebuffer" });
        const arrayBuffer = buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength
        ) as ArrayBuffer;
        return new Response(arrayBuffer, {
          headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": 'attachment; filename="wari-toilet-rating.zip"',
          },
        });
      },
    },
  },
});
