#!/usr/bin/env node

/**
 * DevKit Build Script
 *
 * Reads source skills from source/skills/ and transforms them
 * into platform-specific outputs for Claude Code and Codex CLI.
 *
 * Usage: node scripts/build.js
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync, existsSync, copyFileSync } from 'fs';
import { join, relative, dirname } from 'path';

// ── Platform Configuration ──────────────────────────────────────────

const PLATFORMS = {
  'claude-code': {
    outputDir: '.claude/skills',
    placeholders: {
      model: 'Claude',
      config_file: 'CLAUDE.md',
      skills_path: '.claude/skills',
      ask_instruction: 'STOP and call the AskUserQuestion tool to clarify.',
    },
    transformFrontmatter: (fm) => fm, // Claude Code uses source format as-is
  },
  codex: {
    outputDir: '.codex/skills',
    placeholders: {
      model: 'GPT',
      config_file: 'AGENTS.md',
      skills_path: '.codex/skills',
      ask_instruction: 'ask the user directly to clarify what you cannot infer.',
    },
    transformFrontmatter: (fm) => {
      // Codex uses simpler frontmatter: name, description, argument-hint, license
      const result = { name: fm.name };
      if (fm.description) result.description = fm.description;
      if (fm.args && fm.args.length > 0) {
        result['argument-hint'] = fm.args
          .map((a) => (a.required ? `<${a.name}>` : `[${a.name}]`))
          .join(' ');
      }
      if (fm.license) result.license = fm.license;
      return result;
    },
    transformBody: (body) => {
      // Convert {{arg}} style to $ARG style for Codex
      return body.replace(/\{\{(\w+)\}\}/g, (match, name) => {
        // Don't convert platform placeholders (already replaced)
        if (['model', 'config_file', 'skills_path', 'ask_instruction'].includes(name)) {
          return match;
        }
        return `$${name.toUpperCase()}`;
      });
    },
  },
};

// ── YAML Frontmatter Parser (minimal) ───────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const fmRaw = match[1];
  const body = match[2];

  // Simple YAML parser for our use case
  const fm = {};
  let currentKey = null;
  let currentValue = '';
  let inMultiline = false;

  for (const line of fmRaw.split('\n')) {
    if (inMultiline) {
      if (line.match(/^\S/) && !line.startsWith(' ')) {
        // New key, save previous
        fm[currentKey] = currentValue.trim();
        inMultiline = false;
      } else {
        currentValue += ' ' + line.trim();
        continue;
      }
    }

    const keyMatch = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      const val = keyMatch[2].trim();
      if (val === '>' || val === '|') {
        inMultiline = true;
        currentValue = '';
      } else if (val === '') {
        fm[currentKey] = '';
      } else {
        fm[currentKey] = val.replace(/^["']|["']$/g, '');
      }
    }
  }
  if (inMultiline && currentKey) {
    fm[currentKey] = currentValue.trim();
  }

  // Parse boolean-like values
  for (const [k, v] of Object.entries(fm)) {
    if (v === 'true') fm[k] = true;
    else if (v === 'false') fm[k] = false;
  }

  return { frontmatter: fm, body };
}

function serializeFrontmatter(fm) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(fm)) {
    if (typeof value === 'string' && value.length > 80) {
      lines.push(`${key}: >`);
      // Wrap long description
      const words = value.split(' ');
      let line = '  ';
      for (const word of words) {
        if (line.length + word.length + 1 > 90) {
          lines.push(line);
          line = '  ' + word;
        } else {
          line += (line.trim() === '' ? '' : ' ') + word;
        }
      }
      if (line.trim()) lines.push(line);
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

// ── File System Helpers ─────────────────────────────────────────────

function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      results.push(...walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

function cleanDir(dir) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true });
  }
  mkdirSync(dir, { recursive: true });
}

// ── Build Pipeline ──────────────────────────────────────────────────

const ROOT = join(import.meta.dirname, '..');
const SOURCE_DIR = join(ROOT, 'source/skills');

function replacePlaceholders(text, placeholders) {
  let result = text;
  for (const [key, value] of Object.entries(placeholders)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

function buildForPlatform(platformName, config) {
  const outputDir = join(ROOT, config.outputDir);
  cleanDir(outputDir);

  const sourceFiles = walkDir(SOURCE_DIR);
  let skillCount = 0;
  let fileCount = 0;

  for (const sourceFile of sourceFiles) {
    if (!sourceFile.endsWith('.md')) continue;

    const relPath = relative(SOURCE_DIR, sourceFile);
    const outPath = join(outputDir, relPath);
    mkdirSync(dirname(outPath), { recursive: true });

    let content = readFileSync(sourceFile, 'utf-8');

    // Only SKILL.md files have frontmatter to transform
    if (relPath.endsWith('SKILL.md')) {
      const { frontmatter, body } = parseFrontmatter(content);

      // Transform frontmatter for this platform
      const transformedFm = config.transformFrontmatter(frontmatter);

      // Replace placeholders in body
      let transformedBody = replacePlaceholders(body, config.placeholders);

      // Platform-specific body transforms
      if (config.transformBody) {
        transformedBody = config.transformBody(transformedBody);
      }

      content = serializeFrontmatter(transformedFm) + '\n' + transformedBody;
      skillCount++;
    } else {
      // Non-SKILL.md files (agent prompts) — just replace placeholders
      content = replacePlaceholders(content, config.placeholders);
      if (config.transformBody) {
        content = config.transformBody(content);
      }
    }

    writeFileSync(outPath, content);
    fileCount++;
  }

  return { skillCount, fileCount };
}

// ── Main ────────────────────────────────────────────────────────────

console.log('DevKit Build');
console.log('============\n');

for (const [name, config] of Object.entries(PLATFORMS)) {
  const { skillCount, fileCount } = buildForPlatform(name, config);
  console.log(`  ${name}: ${skillCount} skills, ${fileCount} files → ${config.outputDir}/`);
}

console.log('\nDone.\n');
