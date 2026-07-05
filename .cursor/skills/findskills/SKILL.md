---
name: findskills
description: Search and discover OpenClaw/Agent skills from ClawHub and GitHub. Use when the user wants to find, compare, recommend, or install skills, browse popular skills, or look up skill details.
---

# FindSkills

Search and discover skills from ClawHub, GitHub, and other sources. Supports Chinese and English queries.

## When to Use

- The user asks to find, search, or discover skills or plugins
- The user wants popular, trending, or recommended skills
- The user asks for details, tags, install commands, or related skills
- The user mentions ClawHub, OpenClaw skills, or skill installation

## Prerequisites

Before running commands, ensure dependencies are installed:

```bash
npm install
```

## How to Run

Use the wrapper script from the repository root context:

```bash
.cursor/skills/findskills/scripts/findskills.sh <command> [args]
```

Or run the CLI directly:

```bash
node src/index.js <command> [args]
```

## Commands

| Command | Usage | Purpose |
| --- | --- | --- |
| `search` | `search <query>` | Search across all sources |
| `search-from` | `search-from <source> <query>` | Search a specific source |
| `info` | `info <skill-name-or-slug>` | Show skill details and install command |
| `related` | `related <skill-name-or-slug>` | Recommend related skills |
| `recommend` | `recommend <interest1> <interest2> ...` | Recommend skills by interests |
| `popular` | `popular` | List popular skills |
| `sources` | `sources` | Check source availability |

### Options

- `--limit`, `-l` — max results (default 10)
- `--sort`, `-o` — sort order (default `relevance`)
- `--source`, `-s` — limit search to one source
- `--help`, `-h` — show help

## Workflow

1. Clarify what the user needs: search, details, recommendations, or popular list
2. Run the matching command and read the CLI output
3. Summarize results with name, description, tags, and install command when available
4. If a skill looks relevant, show its `clawhub install <slug>` command from the output

## Examples

```bash
.cursor/skills/findskills/scripts/findskills.sh search "web scraping"
.cursor/skills/findskills/scripts/findskills.sh info browser
.cursor/skills/findskills/scripts/findskills.sh popular --limit 5
.cursor/skills/findskills/scripts/findskills.sh recommend automation python
.cursor/skills/findskills/scripts/findskills.sh sources
```

## Notes

- Default command is `search` when only a query is provided
- Results may include install commands such as `clawhub install <slug>`
- If a source is unavailable, run `sources` and explain which backends failed

## MCP Tools (Preferred in Cursor)

This project also exposes MCP tools via `.cursor/mcp.json`. After opening the repo in Cursor, enable the `findskills` server under **Customize → Tools & MCP**.

Available tools:

| Tool | Purpose |
| --- | --- |
| `search_skills` | Search skills by keyword |
| `get_skill_info` | Get skill details |
| `get_related_skills` | Find related skills |
| `recommend_skills` | Recommend by interests |
| `get_popular_skills` | List popular skills |
| `check_skill_sources` | Check source availability |

Prefer MCP tools in Cursor Agent chat when they are enabled. Fall back to the CLI wrapper when MCP is unavailable.

Manual MCP startup for debugging:

```bash
npm run mcp
```

MCP logs: Output panel → **MCP Logs**.
