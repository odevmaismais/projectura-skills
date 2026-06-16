# Projectura — clientes & skills

Distribuíveis públicos do **[Projectura](https://projectura-next.vercel.app)**: skills para Claude,
o shim **MCP** (stdio) e o plugin git-installable. Aqui ficam
as peças que você instala para **usar** o Projectura por IA.

## Conteúdo

| Pasta | O que é |
|---|---|
| [`skills/`](./skills) | Pacote de skills `@projectura/skills` (tarefas, releases, sprint, inbox, status, tempo, docs) |
| [`mcp-stdio/`](./mcp-stdio) | Shim `@projectura/mcp` (ponte stdio→HTTP) + bundle `.mcpb` p/ Claude Desktop |
| [`.claude-plugin/`](./.claude-plugin) | Manifesto do plugin Claude (git-installable) |

## Começar (2 minutos)

1. **Gere um token (PAT)** em <https://projectura-next.vercel.app/mcp>.
2. **Conecte** no Claude Code (em qualquer pasta):
   ```bash
   claude mcp add --transport http projectura https://projectura-next.vercel.app/api/mcp \
     --header "Authorization: Bearer SEU_TOKEN"
   ```
3. **Instale as skills** — escolha um canal:
   ```bash
   npx @projectura/skills                                  # copia p/ ~/.claude/skills
   # ou plugin git-installable no Claude Code:
   #   /plugin install https://github.com/odevmaismais/projectura-skills
   ```

## Documentação

- **Guia de uso:** <https://projectura-next.vercel.app/wiki>
- **Automação com IA / conector MCP:** <https://projectura-next.vercel.app/mcp>

## Licença

MIT — ver [LICENSE](./LICENSE).
