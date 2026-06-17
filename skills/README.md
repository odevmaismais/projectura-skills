# Projectura Skills

Skills prontas para operar o **Projectura** (tarefas, releases, sprint, inbox, status, tempo, docs)
a partir de qualquer Claude (Code/Desktop/API), usando o **conector MCP**.

## Pré-requisito

O server MCP **`projectura`** precisa estar conectado (PAT). Gere o token e conecte em
<https://projectura-next.vercel.app/mcp>:

```bash
claude mcp add --transport http projectura https://projectura-next.vercel.app/api/mcp \
  --header "Authorization: Bearer SEU_TOKEN"
```

## Catálogo

| Skill | Quando dispara | Tools MCP |
|---|---|---|
| `projectura-tasks` | criar/editar/mover/triar tarefas, subtarefas, quebrar épico | `tasks_*`, `projects_list` |
| `projectura-releases` | abrir/avançar release, vincular tarefas | `releases_*`, `tasks_list` |
| `projectura-sprint` | planejar sprint, distribuir tarefas | `tasks_list/update`, `teams_*` |
| `projectura-inbox` | triar inbox, ver bloqueios | `notifications_*`, `tasks_get/move` |
| `projectura-status` | status report → doc | `tasks_list`, `releases_list`, `docs_create` |
| `projectura-time` | lançar horas | `tasks_log_time`, `tasks_list` |
| `projectura-docs` | criar/editar documentos | `docs_*` |

## Instalação

### npm
```bash
npx @projectura/skills          # copia as skills para ~/.claude/skills/
# ou global: npm i -g @projectura/skills && projectura-skills
```

### Plugin Claude Code (marketplace — recomendado)
```
/plugin marketplace add odevmaismais/projectura-skills
/plugin install projectura@projectura
```

### Copiar manualmente
```bash
cp -r projectura-* ~/.claude/skills/
```

## Segurança

As skills herdam o modelo do conector: **PAT + escopo + membership**. Use `--scopes read` para
skills só-leitura (inbox/status). Ações destrutivas (delete) sempre confirmam antes.

Guia completo: <https://projectura-next.vercel.app/wiki/Automacao-com-IA>
