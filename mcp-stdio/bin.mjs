#!/usr/bin/env node
// Ponte stdio→HTTP do conector MCP do Projectura (para clientes que só falam stdio, ex.: Claude
// Desktop). Encapsula `mcp-remote` apontando para o endpoint HTTP hospedado, com o PAT no header.
//
// Robustez (Claude Desktop usa um Node EMBUTIDO, sem npx no PATH): roda o `mcp-remote` VENDORADO
// (dependência, empacotada no .mcpb) com o MESMO node que executa este arquivo (`process.execPath`),
// SEM npx e SEM shell — elimina os 4 modos de falha no Windows/Desktop: npx fora do PATH, download
// no boot estourando o timeout, quebra do pipe stdio pela camada do cmd.exe, e o header com espaço
// chegando vazio por falta de aspas no shell.
//
// Uso (Claude Desktop / mcp.json):
//   { "command": "npx", "args": ["-y", "@projectura/mcp"], "env": { "PROJECTURA_TOKEN": "pj_…" } }
// Ou direto:
//   PROJECTURA_TOKEN=pj_… npx @projectura/mcp
//   npx @projectura/mcp --token pj_… --url https://projectura-next.vercel.app/api/mcp
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const argv = process.argv.slice(2);
const arg = (name) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : undefined; };

const token = process.env.PROJECTURA_TOKEN || arg("token");
const url = process.env.PROJECTURA_URL || arg("url") || "https://projectura-next.vercel.app/api/mcp";

if (!token || !token.startsWith("pj_")) {
  console.error("[@projectura/mcp] Defina PROJECTURA_TOKEN=pj_… (ou --token pj_…). Gere em /mcp.");
  process.exit(1);
}

const header = `Authorization: Bearer ${token}`;
const remoteArgs = [url, "--header", header];

let child;
try {
  // Preferido: mcp-remote vendorado, rodado pelo node atual — sem npx, sem shell.
  // O header com espaço vira UM argv (não passa por shell), então chega íntegro.
  const entry = require.resolve("mcp-remote/dist/proxy.js");
  console.error(`[@projectura/mcp] mcp-remote vendorado via node embutido → ${url}`);
  child = spawn(process.execPath, [entry, ...remoteArgs], { stdio: "inherit" });
} catch {
  // Fallback (dev sem node_modules instalado): npx. No Windows precisa de shell:true + header quotado.
  const win = process.platform === "win32";
  console.error(`[@projectura/mcp] mcp-remote não vendorado; via npx → ${url}`);
  child = spawn(
    "npx",
    ["-y", "mcp-remote@latest", url, "--header", win ? `"${header}"` : header],
    { stdio: "inherit", shell: win },
  );
}
child.on("error", (e) => { console.error("[@projectura/mcp] falha ao iniciar mcp-remote:", e.message); process.exit(1); });
child.on("exit", (code) => process.exit(code ?? 0));
