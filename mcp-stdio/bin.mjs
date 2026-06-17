#!/usr/bin/env node
// Ponte stdio→HTTP do conector MCP do Projectura (para clientes que só falam stdio, ex.: algumas
// configs do Claude Desktop). Encapsula `mcp-remote` apontando para o endpoint HTTP hospedado, com
// o PAT no header Authorization.
//
// Uso (Claude Desktop / mcp.json):
//   { "command": "npx", "args": ["-y", "@projectura/mcp"], "env": { "PROJECTURA_TOKEN": "pj_…" } }
// Ou direto:
//   PROJECTURA_TOKEN=pj_… npx @projectura/mcp
//   npx @projectura/mcp --token pj_… --url https://projectura-next.vercel.app/api/mcp
import { spawn } from "node:child_process";

const argv = process.argv.slice(2);
const arg = (name) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : undefined; };

const token = process.env.PROJECTURA_TOKEN || arg("token");
const url = process.env.PROJECTURA_URL || arg("url") || "https://projectura-next.vercel.app/api/mcp";

if (!token || !token.startsWith("pj_")) {
  console.error("[@projectura/mcp] Defina PROJECTURA_TOKEN=pj_… (ou --token pj_…). Gere em /mcp.");
  process.exit(1);
}

// Bridge oficial stdio↔streamable-HTTP. `-y` evita o prompt de instalação do npx.
// Windows precisa de shell:true p/ resolver o `npx.cmd` (e o Node 22 exige shell p/ .cmd), MAS
// com shell:true o Node NÃO quota argumentos com espaço → o valor `Authorization: Bearer pj_…`
// chegava quebrado (header vazio → 401 → "disconnected"). Quotamos o header só no Windows.
const win = process.platform === "win32";
const headerVal = `Authorization: Bearer ${token}`;
const child = spawn(
  "npx",
  ["-y", "mcp-remote@latest", url, "--header", win ? `"${headerVal}"` : headerVal],
  { stdio: "inherit", shell: win },
);
child.on("error", (e) => { console.error("[@projectura/mcp] falha ao iniciar mcp-remote:", e.message); process.exit(1); });
child.on("exit", (code) => process.exit(code ?? 0));
