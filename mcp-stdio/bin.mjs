#!/usr/bin/env node
// Ponte stdio↔streamable-HTTP SELF-CONTAINED do conector MCP do Projectura. Lê JSON-RPC do stdin,
// faz POST autenticado no endpoint HTTP e escreve a(s) resposta(s) no stdout. SEM dependências e
// SEM subprocesso.
//
// Por quê não mcp-remote: sob o Node EMBUTIDO do Claude Desktop, um subprocesso com stdio:inherit
// NÃO recebia o stdin que o Desktop manda pro processo principal (o "initialize" chegava no bin.mjs,
// mas o filho mcp-remote nunca via) → o server "exiting early" / disconnected. Este bin.mjs É o
// server stdio (lê process.stdin direto, padrão de todo MCP server), então recebe o stdin.
//
// Uso: PROJECTURA_TOKEN=pj_… npx @projectura/mcp   ·   npx @projectura/mcp --token pj_… --url <endpoint>
import { createInterface } from "node:readline";

const argv = process.argv.slice(2);
const arg = (n) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : undefined; };
const token = process.env.PROJECTURA_TOKEN || arg("token");
const url = process.env.PROJECTURA_URL || arg("url") || "https://projectura-next.vercel.app/api/mcp";

const log = (m) => { try { process.stderr.write(`[@projectura/mcp] ${m}\n`); } catch {} };
const out = (obj) => { try { process.stdout.write(JSON.stringify(obj) + "\n"); } catch {} };
const safeJson = (s) => { try { return JSON.parse(s); } catch { return null; } };

if (!token || !token.startsWith("pj_")) {
  log("Defina PROJECTURA_TOKEN=pj_… (ou --token pj_…). Gere em /mcp → Configurações → Integrações.");
  process.exit(1);
}
log(`ponte stdio→HTTP pronta → ${url}`);

// Stateless: o servidor pode (ou não) emitir Mcp-Session-Id; ecoamos se vier. Idem protocol version.
let sessionId = null;
let protocolVersion = null;

function sseMessages(body) {
  const msgs = [];
  for (const line of body.split(/\r?\n/)) {
    if (line.startsWith("data:")) {
      const d = line.slice(5).trim();
      if (d && d !== "[DONE]") { const j = safeJson(d); if (j) msgs.push(j); }
    }
  }
  return msgs;
}

let pending = 0;
let closing = false;
const maybeExit = () => { if (closing && pending === 0) process.exit(0); };

async function forward(raw, msg) {
  pending++;
  try {
    await doForward(raw, msg);
  } finally {
    pending--;
    maybeExit();
  }
}

async function doForward(raw, msg) {
  const headers = {
    "content-type": "application/json",
    "accept": "application/json, text/event-stream",
    "authorization": `Bearer ${token}`,
  };
  if (sessionId) headers["mcp-session-id"] = sessionId;
  if (protocolVersion) headers["mcp-protocol-version"] = protocolVersion;

  let res;
  try {
    res = await fetch(url, { method: "POST", headers, body: raw });
  } catch (e) {
    log(`rede: ${e?.message || e}`);
    if (msg?.id != null) out({ jsonrpc: "2.0", id: msg.id, error: { code: -32000, message: `Projectura MCP: falha de rede (${e?.message || e})` } });
    return;
  }

  const sid = res.headers.get("mcp-session-id");
  if (sid) sessionId = sid;
  if (res.status === 202 || res.status === 204) return; // ack de notification/response — sem corpo

  const body = await res.text();
  if (!res.ok) {
    const j = safeJson(body);
    const detail = j?.error_description || j?.error || body.slice(0, 200) || `HTTP ${res.status}`;
    log(`HTTP ${res.status}: ${detail}`);
    if (msg?.id != null) out({ jsonrpc: "2.0", id: msg.id, error: { code: -32001, message: `Projectura MCP: ${detail}` } });
    return;
  }

  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const items = ct.includes("text/event-stream")
    ? sseMessages(body)
    : (body.trim() ? [safeJson(body)].filter(Boolean) : []);
  for (const it of items) out(it);
}

const rl = createInterface({ input: process.stdin, terminal: false });
rl.on("line", (line) => {
  const raw = line.trim();
  if (!raw) return;
  const msg = safeJson(raw);
  if (msg?.method === "initialize" && msg.params?.protocolVersion) protocolVersion = msg.params.protocolVersion;
  void forward(raw, msg);
});
rl.on("close", () => { closing = true; maybeExit(); });
