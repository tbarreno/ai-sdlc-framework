# Simple AI-SDLC Framework 🤖🚀

**Repository:** [github.com/tbarreno/ai-sdlc-framework](https://github.com/tbarreno/ai-sdlc-framework)

> **Spec-Driven Software Development Methodology for AI Agents**  
> Streamline requirement analysis, architecture design, task planning, execution, releases, and bugfixing across **Cursor**, **Claude**, **Gemini**, and **ChatGPT**.

## 💡 Overview

The **AI-SDLC Framework** brings a structured, reproducible, and agentic **Software Development Life Cycle (SDLC)** to AI-assisted coding. Inspired by Spec-Driven Development principles (such as *OpenSPEC* and *BMAD*), this framework treats specifications and architectural documentation as the **executable single source of truth** for both humans and AI models.

### Key Highlights
- 🎯 **Spec-Driven Workflow**: Specifications first, execution second. Minimizes hallucinations and code drift.
- 🔄 **Kanban-Style Lifecycle States**: Track features, bugs, and experiments across clear progress phases (`definition ➔ ready-for-design ➔ ready-for-implementation ➔ in-progress ➔ ready-for-release ➔ released`).
- 📊 **Live status board**: `/sdlc-status` regenerates `docs/status-board.md` with Kanban tables for all specs (read-only snapshot).
- 📦 **Release & Version Management**: Group completed work into structured release files (`docs/releases/*.md`) for clean changelogs and version tracking.
- 🏢 **Greenfield & Brownfield Support**: Works out-of-the-box for brand new projects or existing codebases via automated architecture discovery.
- 🌿 **3 Primary Entry Points**: Dedicated workflows for **Features**, **Bug Investigations**, and **Technical Experiments / PoCs**.
- 🧩 **Modular Component Architecture**: High-level system architecture (`docs/architecture.md`) linked with dedicated component specifications (`docs/components/*.md`).
- 🤖 **Multi-Agent & Multi-Platform**: Centralized configuration supporting Cursor, Claude Code, Gemini CLI, and ChatGPT/OpenAI agents.
- 🗣️ **Configurable Language & Explanations**: Single-source configuration (`docs/config.yaml`) for project language and target audience technical depth.

## 🛠️ Quick Start & Installation

You can initialize the framework in any project using `npx` or by installing the package via NPM.

### 1. Initial interactive CLI Setup

Run the following command in your project root directory:

```bash
npx @tbarreno/ai-sdlc-framework init

# or simply (init is the default command)
npx @tbarreno/ai-sdlc-framework

# refresh rules/commands/templates after a framework upgrade
npx @tbarreno/ai-sdlc-framework update

npx @tbarreno/ai-sdlc-framework help
```
The interactive CLI will prompt you to configure:

- **Target Project Language** (`en`, `es`, `fr`, etc.)
- **Communication Style** (`simple` jargon-free or `technical`)
- **Target AI Platforms** (Cursor, Claude, Gemini, ChatGPT)

```text
  ___  ___      ____ ____  _     ____ 
 / _ \|_ _|    / ___|  _ \| |   / ___|
| |_| || |     \___ \ | | | |  | |    
|  _  || |      ___)| |_| | |__| |___ 
|_| |_|___|    |____/____/|_____\____|

✔ Select project language: English (en)
✔ Select explanation style: Simple & direct (jargon-free)
✔ Select AI platforms to configure:
  [x] Cursor (.cursor/rules/)
  [x] Claude Code / Desktop (.claude/)
  [x] Gemini CLI / Studio (.gemini/)
  [ ] ChatGPT / OpenAI Agent (.openai/)

[INFO] Creating documentation structure...
[INFO] Generating docs/config.yaml...
[INFO] Copying rules & commands from files/ to selected targets...
[SUCCESS] AI-SDLC Framework successfully configured!
```

### 2. Updating the Framework (update)

If you want to pull the latest rules and command improvements into an existing project without losing your `docs/config.yaml` or change history:

```bash
npx @tbarreno/ai-sdlc-framework update
```

```text
┌   AI-SDLC Framework Updater 
│
◇  Framework components updated successfully!
│
◇  Update Complete ───────────────────────────────╮
│                                                 │
│  Preserved: docs/config.yaml & docs/history.md  │
│  Updated platforms: cursor                      │
│  Updated templates in: templates/               │
│                                                 │
├─────────────────────────────────────────────────╯
│
└  Framework is up to date! 🚀
```

## 📁 Repository & Documentation Architecture

After running the installer, your project directory will contain:

```text
my-project/
├── .cursor/rules/             # Cursor: rules (.mdc)
├── .cursor/commands/          # Cursor: slash commands (.md)
├── .claude/rules/             # Claude Code: project rules (.md)
├── .claude/commands/          # Claude Code: slash commands (.md)
├── GEMINI.md                  # Gemini CLI: merged context (managed block)
├── .gemini/                   # Gemini: helper README (optional)
├── AGENTS.md                  # Codex: merged instructions (managed block)
├── .openai/                   # ChatGPT/Codex: instructions + command copies
├── docs/
│   ├── config.yaml            # Central methodology & language configuration
│   ├── inception.md           # Scope, constraints, and inception record
│   ├── architecture.md        # High-level single source of truth for architecture
│   ├── history.md             # Chronological audit trail of all changes
│   ├── components/            # Specific component architecture files
│   ├── features/              # Feature specifications and task breakdowns
│   ├── bugs/                  # Bug investigations and fix plans
│   ├── experiments/           # Tradeoff evaluations and PoCs
│   ├── releases/              # Official release notes and version tracking
│   └── status-board.md        # Kanban snapshot (regenerate with /sdlc-status)
├── templates/                 # Markdown templates with YAML frontmatter
└── README.md                  # Project inception & overview
```

**Note for Contributors / Maintainers**: All master rules and commands are centrally maintained in `files/rules/` and `files/commands/`. The CLI distributes them per platform (copy, convert `.mdc` → `.md` where needed, or merge into `GEMINI.md` / `AGENTS.md`). See [`docs/multi-platform.md`](docs/multi-platform.md).

## 🔄 SDLC Phases & Agent Commands

The framework structures development into 6 core phases plus an initial Inception phase:


| Phase	  | Command         | Purpose | Primary Artifacts |
| ------- | --------------- | ------- | ----------------- |
| Phase 0 | `/sdlc-inception` | Setup for new or existing repos: README, inception record, architecture | `README.md`, `docs/inception.md`, `docs/architecture.md`
| Phase 1 | `/sdlc-analyze` | Analyze requirements for Features, Bugs, or Experiments (creates spec in `definition`) | `docs/features/*`, `docs/bugs/*`, `docs/experiments/*`
| Phase 1 | `/sdlc-close-analysis` | Close analysis; promote spec to `ready-for-design` (also when user confirms analysis is complete) | Spec frontmatter, `docs/history.md`
| Phase 2 | `/sdlc-design` | Technical design while status is `ready-for-design`; update components & architecture | `docs/components/*`, `docs/architecture.md`
| Phase 2 | `/sdlc-close-design` | Close design; promote spec to `ready-for-implementation` | Spec frontmatter, `docs/history.md`
| Phase 3 | `/sdlc-plan` | Plan releases; select specs in `ready-for-implementation` → `in-progress` | `docs/releases/*.md`, task lists
| Phase 4 | `/sdlc-dev` | Implement tasks while `in-progress`; when all tasks pass → `ready-for-release` | Source code, tests
| Phase 5 | `/sdlc-release` | Verify release checklist; promote specs to `released` | `docs/releases/*.md`, `docs/history.md`
| Anytime | `/sdlc-status` | Kanban-style board: scan all specs and refresh `docs/status-board.md` | `docs/status-board.md`

Bugs and experiments follow the **same status flow** as features; use `/sdlc-analyze` with type BUG or EXP (no separate fix command).

**Spec statuses (Kanban):** `definition` → `ready-for-design` → `ready-for-implementation` → `in-progress` → `ready-for-release` → `released` (experiments may also use terminal `rejected`).

### Command reference (9 workflows)

| Command | Summary |
| :--- | :--- |
| `/sdlc-inception` | Project setup: README, `docs/inception.md`, architecture |
| `/sdlc-analyze` | New feature, bug, or experiment spec (`definition`) |
| `/sdlc-close-analysis` | Close analysis → `ready-for-design` |
| `/sdlc-design` | Component/architecture design |
| `/sdlc-close-design` | Close design → `ready-for-implementation` |
| `/sdlc-plan` | Release planning → `in-progress` |
| `/sdlc-dev` | Implement tasks → `ready-for-release` |
| `/sdlc-release` | Publish release → `released` |
| `/sdlc-status` | Refresh Kanban board at `docs/status-board.md` |

## ⚙️ Configuration (docs/config.yaml)

Each installed project gets its own `docs/config.yaml` (from the framework template on `npx @tbarreno/ai-sdlc-framework init`). Edit it to change language, paths, or methodology flags.

### Version field (`version` in config vs npm package)

| Version | Where | Meaning |
| :--- | :--- | :--- |
| **npm package** | `@tbarreno/ai-sdlc-framework` (e.g. `1.0.0`) | Release of the CLI, rules, commands, and templates. Follows [semver](https://semver.org/). |
| **Methodology schema** | `version` inside **your** `docs/config.yaml` (e.g. `1.1.0`) | Shape of the config file and documented SDLC phases—not tied to the npm version. Bump when the config schema or phase model changes. |

To update project language or methodology settings, edit `docs/config.yaml`:

```yaml
version: "1.1.0"

language:
  code: "en"                       # Options: en, es, fr, de, pt, etc.
  user_explanations: "simple"      # "simple" or "technical"
  documentation_style: "clear"

paths:
  base_docs: "docs"
  architecture_file: "docs/architecture.md"
  history_file: "docs/history.md"
  inception_file: "docs/inception.md"
  components_dir: "docs/components"
  features_dir: "docs/features"
  bugs_dir: "docs/bugs"
  experiments_dir: "docs/experiments"
  releases_dir: "docs/releases"
  status_board_file: "docs/status-board.md"
  templates_dir: "templates"

platforms:
  - cursor
  - claude

rules:
  auto_update_history: true
  single_architecture_source: true
  require_frontmatter: true
  mode: "spec-driven"
```

The `phases` block (in the full template copied at init) lists SDLC phase names for agents; see the repository template for the complete file.

The **`platforms`** list records which agents the installer syncs (chosen at init). Edit it to add or remove providers, then run `npx @tbarreno/ai-sdlc-framework update` (or `ai-sdlc update` if installed globally).

## 📦 Publishing & packaging (maintainers)

Before publishing, run `npm pack --dry-run` and confirm only intended paths are listed (`package.json` `files` allowlist: `bin/`, `files/`, `templates/`, `docs/config.yaml`, `LICENSE.txt`, plus `README.md`). Do not commit `*.tgz` or `node_modules/`.

Scoped package **`@tbarreno/ai-sdlc-framework`** is configured with `"publishConfig": { "access": "public" }`. First publish:

```bash
npm login
npm publish --access public
```

After global install (`npm i -g @tbarreno/ai-sdlc-framework`), the CLI command remains **`ai-sdlc`**.

## 📄 License

Distributed under the [MIT License](https://opensource.org/license/mit).
