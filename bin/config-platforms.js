const PLATFORMS_BLOCK_RE = /^platforms:\s*\n((?:  - .+\n)*)/m;
const VALID_PLATFORMS = new Set(["cursor", "claude", "gemini", "openai"]);

export function injectPlatformsIntoConfig(content, platforms) {
  const normalized = platforms.filter((p) => VALID_PLATFORMS.has(p));
  if (normalized.length === 0) {
    throw new Error("At least one valid platform is required.");
  }

  const block = `platforms:\n${normalized.map((p) => `  - ${p}`).join("\n")}\n`;

  if (PLATFORMS_BLOCK_RE.test(content)) {
    return content.replace(PLATFORMS_BLOCK_RE, block);
  }

  return content.replace(
    /(# --- Agent Execution Rules ---)/,
    `# --- Target AI platforms (ai-sdlc update syncs rules/commands for these) ---\n${block}\n$1`,
  );
}

export function readConfiguredPlatforms(configYamlText) {
  const match = configYamlText.match(PLATFORMS_BLOCK_RE);
  if (!match) return null;

  const items = [...match[1].matchAll(/^  - (\S+)/gm)]
    .map((m) => m[1])
    .filter((p) => VALID_PLATFORMS.has(p));

  return items.length > 0 ? items : null;
}
