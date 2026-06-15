#!/usr/bin/env node
// Instala as skills do Projectura em ~/.claude/skills/. Idempotente (sobrescreve).
// Uso: npx @projectura/skills   |   node skills/install.mjs   |   --dir <alvo>
import { cp, mkdir, readdir, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const dirFlag = argv.indexOf("--dir");
const target = dirFlag >= 0 && argv[dirFlag + 1] ? argv[dirFlag + 1] : join(homedir(), ".claude", "skills");

const entries = await readdir(here, { withFileTypes: true });
const skills = entries.filter((e) => e.isDirectory() && e.name.startsWith("projectura-")).map((e) => e.name);
if (!skills.length) {
  console.error("Nenhuma skill projectura-* encontrada ao lado de install.mjs.");
  process.exit(1);
}

await mkdir(target, { recursive: true });
for (const name of skills) {
  const src = join(here, name);
  const skillFile = join(src, "SKILL.md");
  try { await stat(skillFile); } catch { continue; } // só pastas com SKILL.md
  await cp(src, join(target, name), { recursive: true });
  console.log(`  ✓ ${name}`);
}

console.log(`\nInstaladas ${skills.length} skills em ${target}`);
console.log("Pré-requisito: conectar o server MCP `projectura` (PAT). Veja https://projectura-next.vercel.app/wiki/Automacao-com-IA\n");
