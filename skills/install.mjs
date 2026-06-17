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
const customDir = dirFlag >= 0 && argv[dirFlag + 1] ? argv[dirFlag + 1] : null;
// Sem --dir: instala nos DOIS diretórios-padrão de skills (SKILL.md é padrão aberto):
//   ~/.claude/skills  → Claude Code
//   ~/.agents/skills  → Codex, Gemini CLI, opencode e demais clientes que adotam o padrão
const targets = customDir
  ? [customDir]
  : [join(homedir(), ".claude", "skills"), join(homedir(), ".agents", "skills")];

const entries = await readdir(here, { withFileTypes: true });
const skills = entries.filter((e) => e.isDirectory() && e.name.startsWith("projectura-")).map((e) => e.name);
if (!skills.length) {
  console.error("Nenhuma skill projectura-* encontrada ao lado de install.mjs.");
  process.exit(1);
}

for (const target of targets) {
  await mkdir(target, { recursive: true });
  let n = 0;
  for (const name of skills) {
    const src = join(here, name);
    try { await stat(join(src, "SKILL.md")); } catch { continue; } // só pastas com SKILL.md
    await cp(src, join(target, name), { recursive: true });
    n++;
  }
  console.log(`  ✓ ${n} skills → ${target}`);
}

console.log("\nPré-requisito: conectar o server MCP `projectura` (PAT). Guia: https://projectura-next.vercel.app/mcp\n");
