#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { injectPlatformsIntoConfig } from "./config-platforms.js";
import {
  detectInstalledPlatforms,
  resolvePlatformsForUpdate,
  syncPlatformFiles,
} from "./platform-sync.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");

const CONFIG_REL_PATH = "docs/config.yaml";

function printHelp() {
  console.log(`
${pc.cyan("ai-sdlc")} — install or update the AI-SDLC framework in the current project

${pc.bold("Usage:")}
  ai-sdlc [init]     Interactive installer (default)
  ai-sdlc init       Same as above
  ai-sdlc update     Refresh rules, commands, and templates (keeps docs/config.yaml & docs/history.md)
  ai-sdlc help       Show this help

${pc.bold("Notes:")}
  • Target AI platforms are stored in ${pc.dim("docs/config.yaml")} under ${pc.dim("platforms:")}.
  • Edit that list, then run ${pc.dim("ai-sdlc update")} to sync additional providers.
`);
}

async function writeProjectConfigFromTemplate(
  projectRoot,
  { language, explanations, platforms },
) {
  const templatePath = path.join(packageRoot, "docs/config.yaml");
  if (!(await fs.pathExists(templatePath))) {
    throw new Error("Missing config template in package (docs/config.yaml).");
  }

  let content = await fs.readFile(templatePath, "utf-8");
  content = content.replace(/^(\s*code:\s*).+$/m, `$1"${language}"`);
  content = content.replace(
    /^(\s*user_explanations:\s*).+$/m,
    `$1"${explanations}"`,
  );
  content = injectPlatformsIntoConfig(content, platforms);

  await fs.writeFile(path.join(projectRoot, CONFIG_REL_PATH), content, "utf-8");
}

async function syncTemplates(projectRoot) {
  const sourceTemplatesDir = path.join(packageRoot, "templates");
  const targetDir = path.join(projectRoot, "templates");
  if (!(await fs.pathExists(sourceTemplatesDir))) return;

  await fs.ensureDir(targetDir);
  const names = await fs.readdir(sourceTemplatesDir);
  for (const name of names) {
    const src = path.join(sourceTemplatesDir, name);
    if ((await fs.stat(src)).isFile()) {
      await fs.copy(src, path.join(targetDir, name), { overwrite: true });
    }
  }
}

async function initializeHistory(projectRoot) {
  const historyPath = path.join(projectRoot, "docs/history.md");
  if (await fs.pathExists(historyPath)) return;

  const historyTpl = path.join(packageRoot, "templates/history.md");
  const row = `| ${new Date().toISOString()} | Initialization | Framework Setup | Completed | docs/config.yaml |`;

  if (await fs.pathExists(historyTpl)) {
    let content = await fs.readFile(historyTpl, "utf-8");
    content = content.replace(
      /\| YYYY-MM-DD HH:MM \| Inception \| Project Setup \| Completed \| `README\.md` \|/,
      row,
    );
    await fs.writeFile(historyPath, content, "utf-8");
    return;
  }

  await fs.writeFile(
    historyPath,
    `# Execution & Change History\n\n| Timestamp (UTC) | Type | ID / Title | Status | Related File |\n| :--- | :--- | :--- | :--- | :--- |\n${row}\n`,
    "utf-8",
  );
}

async function runUpdate(projectRoot) {
  p.intro(pc.bgBlue(pc.black(" AI-SDLC Framework Updater ")));

  const configPath = path.join(projectRoot, CONFIG_REL_PATH);
  if (!(await fs.pathExists(configPath))) {
    p.log.error(
      pc.red(`No ${CONFIG_REL_PATH} found. Please run "ai-sdlc init" first.`),
    );
    process.exit(1);
  }

  const s = p.spinner();
  s.start("Updating framework rules, commands, and templates...");

  try {
    let platforms = await resolvePlatformsForUpdate(projectRoot);
    let usedFallback = false;

    if (!platforms?.length) {
      usedFallback = true;
      platforms = ["cursor"];
    }

    await syncPlatformFiles(projectRoot, platforms, packageRoot);
    await syncTemplates(projectRoot);

    s.stop("Framework components updated successfully!");

    if (usedFallback) {
      p.log.warn(
        pc.yellow(
          "No platforms: in docs/config.yaml and none detected on disk. Synced cursor only. Add a platforms: list to config (see ai-sdlc help).",
        ),
      );
    }

    p.note(
      `Preserved: ${pc.green("docs/config.yaml")} & ${pc.green("docs/history.md")}\n` +
        `Updated platforms: ${pc.cyan(platforms.join(", "))}\n` +
        `Updated templates in: ${pc.cyan("templates/")} (framework files only; extra files kept)`,
      "Update Complete",
    );

    p.outro(pc.green("Framework is up to date! 🚀"));
  } catch (error) {
    s.stop("Update failed.");
    p.log.error(pc.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

async function runInit(projectRoot) {
  p.intro(pc.bgCyan(pc.black(" AI-SDLC Framework Installer ")));

  const configPath = path.join(projectRoot, CONFIG_REL_PATH);
  if (await fs.pathExists(configPath)) {
    p.log.error(
      pc.red(
        `${CONFIG_REL_PATH} already exists. This project is already initialized.`,
      ),
    );
    p.log.message(
      pc.dim('Run "ai-sdlc update" to refresh rules, commands, and templates.'),
    );
    process.exit(1);
  }

  const config = await p.group(
    {
      language: () =>
        p.select({
          message:
            "Select preferred project documentation and interaction language:",
          options: [
            { value: "en", label: "English (en)" },
            { value: "es", label: "Spanish (es)" },
            { value: "fr", label: "French (fr)" },
            { value: "de", label: "German (de)" },
            { value: "pt", label: "Portuguese (pt)" },
          ],
          initialValue: "en",
        }),

      explanations: () =>
        p.select({
          message: "Select explanation style for user communication:",
          options: [
            {
              value: "simple",
              label: "Simple & direct (jargon-free, easy to understand)",
            },
            {
              value: "technical",
              label: "Technical & detailed (in-depth architectural details)",
            },
          ],
          initialValue: "simple",
        }),

      platforms: () =>
        p.multiselect({
          message:
            "Select AI platforms / editors you plan to use in this project:",
          options: [
            {
              value: "cursor",
              label: "Cursor (.cursor/rules + .cursor/commands)",
              hint: "Recommended",
            },
            {
              value: "claude",
              label: "Claude Code (.claude/rules + .claude/commands)",
            },
            {
              value: "gemini",
              label: "Gemini CLI (GEMINI.md + .gemini/)",
            },
            {
              value: "openai",
              label: "Codex / ChatGPT (AGENTS.md + .openai/)",
            },
          ],
          required: true,
        }),
    },
    {
      onCancel: () => {
        p.cancel("Installation cancelled.");
        process.exit(0);
      },
    },
  );

  const s = p.spinner();
  s.start("Initializing AI-SDLC Framework structure...");

  try {
    const dirsToCreate = [
      "docs",
      "docs/components",
      "docs/features",
      "docs/bugs",
      "docs/experiments",
      "docs/releases",
      "templates",
    ];

    for (const dir of dirsToCreate) {
      await fs.ensureDir(path.join(projectRoot, dir));
    }

    await writeProjectConfigFromTemplate(projectRoot, {
      language: config.language,
      explanations: config.explanations,
      platforms: config.platforms,
    });

    await syncTemplates(projectRoot);
    await initializeHistory(projectRoot);
    await syncPlatformFiles(projectRoot, config.platforms, packageRoot);

    s.stop("AI-SDLC Framework structure created successfully!");

    p.note(
      `Language: ${pc.cyan(config.language)}\n` +
        `Platforms: ${pc.cyan(config.platforms.join(", "))} (saved in docs/config.yaml)\n\n` +
        `Next step: Run ${pc.green("/sdlc-inception")} in your AI assistant to start your project setup.`,
      "Setup Complete",
    );

    p.outro(pc.green("Ready to build software with AI agents! 🚀"));
  } catch (error) {
    s.stop("Installation failed.");
    p.log.error(pc.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

async function main() {
  if (process.stdout.isTTY) console.clear();

  const args = process.argv.slice(2);
  const command = (args[0] || "init").toLowerCase();

  if (command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "update") {
    await runUpdate(process.cwd());
    return;
  }

  if (command === "init") {
    await runInit(process.cwd());
    return;
  }

  p.log.error(pc.red(`Unknown command: ${args[0]}`));
  printHelp();
  process.exit(1);
}

main();
