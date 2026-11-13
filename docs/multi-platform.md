# Multi-platform installation (maintainers)

Canonical sources live under `files/rules/` and `files/commands/` (`.mdc`).  
`bin/platform-sync.js` maps them to each agent’s expected layout on `init`, `update`, and `platforms`.

## CLI commands

| Command | Behavior |
| :--- | :--- |
| **`ai-sdlc init`** | Multiselect → writes `platforms:` → `syncPlatformFiles` for selected IDs. |
| **`ai-sdlc update`** | Reads `platforms:` from `docs/config.yaml` only (via `resolvePlatformsForUpdate`). No disk detection, no Cursor fallback. Errors if the list is empty. Also refreshes `templates/` from the package. |
| **`ai-sdlc platforms`** | Interactive multiselect; updates `platforms:` with `injectPlatformsIntoConfig`; optional `removePlatformArtifactsForMany`; then `syncPlatformFiles` for the new selection. Warns when `detectInstalledPlatforms` finds targets not listed in config. |

Shared option labels live in `bin/config-platforms.js` → `PLATFORM_CHOICES`.

## Removing a platform safely

`removePlatformArtifacts(projectRoot, platform)` only deletes **framework-owned** content:

| Platform | Removed |
| :--- | :--- |
| **cursor** | `sdlc-*` in `.cursor/rules` and `.cursor/commands` |
| **claude** | `sdlc-*` in `.claude/rules` and `.claude/commands` |
| **gemini** | Managed block in `GEMINI.md`; `.gemini/README.md` (AI-SDLC); legacy `.mdc` in `.gemini/`; empty dirs |
| **openai** | Managed block in `AGENTS.md`; AI-SDLC files under `.openai/`; `sdlc-*` under `.openai/commands` and `.openai/rules` |

Non-SDLC rules in `.cursor/` or `.claude/` are kept. Text in `GEMINI.md` / `AGENTS.md` **outside** the HTML comment markers is kept.

**Commands shipped (12):** `sdlc-inception`, `sdlc-new-epic`, `sdlc-analyze-epic`, `sdlc-analyze`, `sdlc-close-analysis`, `sdlc-design`, `sdlc-close-design`, `sdlc-plan`, `sdlc-dev`, `sdlc-release`, `sdlc-status`, `sdlc-epic-status`.

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
