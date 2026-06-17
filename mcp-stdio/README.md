# @projectura/mcp — ponte stdio→HTTP

Conecta o **conector MCP do Projectura** (HTTP hospedado) a clientes que só falam **stdio**.
Ponte **direta** — sem dependências, sem subprocesso: lê JSON-RPC do stdin, faz `POST` no endpoint
`https://projectura-next.vercel.app/api/mcp` com o seu PAT e devolve a resposta no stdout. (Antes via
`mcp-remote`; trocado por ponte própria porque o subprocesso não recebia o stdin sob o Node embutido
do Claude Desktop.)

> Se o seu cliente fala **streamable HTTP** (Claude Code, Cursor), prefira conectar direto ao
> endpoint — ver [/mcp](https://projectura-next.vercel.app/mcp). Use este shim só para stdio.

## Uso

Gere um PAT em [/mcp](https://projectura-next.vercel.app/mcp) e:

```bash
PROJECTURA_TOKEN=pj_… npx @projectura/mcp
# ou
npx @projectura/mcp --token pj_… --url https://projectura-next.vercel.app/api/mcp
```

### Claude Desktop (config JSON)
```json
{
  "mcpServers": {
    "projectura": {
      "command": "npx",
      "args": ["-y", "@projectura/mcp"],
      "env": { "PROJECTURA_TOKEN": "pj_SEU_TOKEN" }
    }
  }
}
```

### Codex (stdio)
```bash
codex mcp add projectura --env PROJECTURA_TOKEN=pj_SEU_TOKEN -- npx -y @projectura/mcp
```

> **Demais clientes** — Claude Code, Antigravity (`serverUrl`+header) e Cursor falam **HTTP direto** no
> endpoint, sem este shim. Lista completa por cliente (copy-paste) em
> **[/mcp](https://projectura-next.vercel.app/mcp)**.

## Bundle `.mcpb` (Claude Desktop one-click)

Já existe um bundle pronto: **[`projectura.mcpb`](./projectura.mcpb)** (formato MCPB/DXT,
self-contained — roda o `bin.mjs` empacotado). Baixe e **abra no Claude Desktop**; ele pede o PAT
(`user_config.token`) e conecta.

Para regenerar (após editar `bin.mjs`/`manifest.json`):
```bash
cd mcp-stdio && npm run build:mcpb        # = npx @anthropic-ai/mcpb pack . projectura.mcpb
```

## Variáveis

| Var / flag | Default | Função |
|---|---|---|
| `PROJECTURA_TOKEN` / `--token` | — (obrigatório) | PAT `pj_…` |
| `PROJECTURA_URL` / `--url` | `https://projectura-next.vercel.app/api/mcp` | endpoint MCP |
