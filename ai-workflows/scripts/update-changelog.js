#!/usr/bin/env node

/**
 * Automatic Changelog Generator
 * Updates CHANGELOG.md based on git commits
 * Run: node ./ai-workflows/scripts/update-changelog.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHANGELOG_PATH = path.join(process.cwd(), 'CHANGELOG.md');

// Conventional commit type mappings
const COMMIT_TYPES = {
  feat: { section: 'Features', emoji: '✨' },
  fix: { section: 'Bug Fixes', emoji: '🐛' },
  perf: { section: 'Performance', emoji: '⚡' },
  refactor: { section: 'Refactoring', emoji: '♻️' },
  style: { section: 'Styling', emoji: '💄' },
  docs: { section: 'Documentation', emoji: '📚' },
  test: { section: 'Tests', emoji: '✅' },
  chore: { section: 'Chores', emoji: '🔧' },
  ci: { section: 'CI/CD', emoji: '👷' },
  build: { section: 'Build', emoji: '📦' }
};

function getLatestCommits(count = 1) {
  try {
    const output = execSync(
      `git log -${count} --pretty=format:"%H|%s|%an|%ai" --no-merges`,
      { encoding: 'utf8' }
    );

    return output.split('\n').filter(Boolean).map(line => {
      const [hash, message, author, date] = line.split('|');
      return { hash: hash.substring(0, 7), message, author, date };
    });
  } catch (error) {
    console.error('Failed to get git commits:', error.message);
    return [];
  }
}

function parseCommitMessage(message) {
  // Parse conventional commit format: type(scope): description
  const match = message.match(/^(\w+)(?:\(([^)]+)\))?\s*:\s*(.+)$/);

  if (match) {
    const [, type, scope, description] = match;
    return {
      type: type.toLowerCase(),
      scope: scope || null,
      description: description.trim()
    };
  }

  // Fallback: treat as chore if no conventional format
  return {
    type: 'chore',
    scope: null,
    description: message
  };
}

function formatChangelogEntry(commit) {
  const parsed = parseCommitMessage(commit.message);
  const typeInfo = COMMIT_TYPES[parsed.type] || COMMIT_TYPES.chore;

  let entry = `- ${typeInfo.emoji} `;
  if (parsed.scope) {
    entry += `**${parsed.scope}:** `;
  }
  entry += parsed.description;
  entry += ` (\`${commit.hash}\`)`;

  return {
    section: typeInfo.section,
    entry
  };
}

function getCurrentChangelog() {
  if (fs.existsSync(CHANGELOG_PATH)) {
    return fs.readFileSync(CHANGELOG_PATH, 'utf8');
  }
  return '';
}

function generateHeader() {
  const date = new Date().toISOString().split('T')[0];
  return `## [Unreleased] - ${date}\n\n`;
}

function updateChangelog() {
  const commits = getLatestCommits(1);

  if (commits.length === 0) {
    console.log('No new commits to process');
    return;
  }

  const currentChangelog = getCurrentChangelog();
  const entries = new Map();

  for (const commit of commits) {
    const { section, entry } = formatChangelogEntry(commit);

    if (!entries.has(section)) {
      entries.set(section, []);
    }
    entries.get(section).push(entry);
  }

  // Build new changelog content
  let newContent = '# Changelog\n\n';
  newContent += 'All notable changes to this project will be documented in this file.\n\n';
  newContent += 'The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\n';
  newContent += 'and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n';

  newContent += generateHeader();

  // Add entries by section
  const sectionOrder = ['Features', 'Bug Fixes', 'Performance', 'Refactoring', 'Styling', 'Documentation', 'Tests', 'Chores', 'CI/CD', 'Build'];

  for (const section of sectionOrder) {
    if (entries.has(section)) {
      newContent += `### ${section}\n\n`;
      newContent += entries.get(section).join('\n') + '\n\n';
    }
  }

  // Preserve existing changelog content (skip header)
  const existingContent = currentChangelog.replace(/^# Changelog[\s\S]*?(?=## \[|$)/, '');
  if (existingContent.trim()) {
    newContent += existingContent;
  }

  fs.writeFileSync(CHANGELOG_PATH, newContent);
  console.log('✅ Changelog updated successfully');
}

// Run if called directly
if (require.main === module) {
  updateChangelog();
}

module.exports = { updateChangelog, parseCommitMessage, formatChangelogEntry };
