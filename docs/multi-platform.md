# Multi-platform installation (maintainers)

Canonical sources live under `files/rules/` and `files/commands/` (`.mdc`).  
`bin/platform-sync.js` maps them to each agent’s expected layout on `init` / `update`.

**Commands shipped (9):** `sdlc-inception`, `sdlc-analyze`, `sdlc-close-analysis`, `sdlc-design`, `sdlc-close-design`, `sdlc-plan`, `sdlc-dev`, `sdlc-release`, `sdlc-status` (Kanban board → `docs/status-board.md`).

| Platform | Rules / context | Commands / workflows |
| :--- | :--- | :--- |
| **Cursor** | `.cursor/rules/*.mdc` | `.cursor/commands/*.md` (from `.mdc`; Cursor expects `.md` slash commands) |
| **Claude Code** | `.claude/rules/*.md` | `.claude/commands/*.md` (slash menu: `/project:<name>`) |
| **Gemini CLI** | Root **`GEMINI.md`** — concatenated rules + commands in a managed HTML-comment block | Same bundle (Gemini loads context files, not a commands folder) |
| **OpenAI Codex** | Root **`AGENTS.md`** — same managed block | `.openai/commands/*.md` + `.openai/instructions.md` for ChatGPT Projects copy/paste |

## Managed sections

For **Gemini** and **Codex**, the installer **upserts** content between:

```html
<!-- ai-sdlc-framework:start -->
…generated content…
<!-- ai-sdlc-framework:end -->
```

Existing `GEMINI.md` / `AGENTS.md` content outside that block is preserved.

## Legacy cleanup

Older installs copied `.mdc` files into `.gemini/` or `.openai/`. Updates remove those stale files and write the layouts above.

## References

- [Cursor rules](https://cursor.com/docs/rules) · commands: `.cursor/commands/*.md`
- [Claude Code `.claude/` directory](https://code.claude.com/docs/en/claude-directory)
- [Gemini CLI GEMINI.md](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html)
- [Codex AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
