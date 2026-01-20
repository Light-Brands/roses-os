#!/usr/bin/env node

/**
 * Design Token Enforcement Script
 * Ensures no hardcoded colors, spacing, or typography values
 * Run: node ./ai-workflows/scripts/check-tokens.js [file]
 */

const fs = require('fs');
const path = require('path');

// Patterns that indicate hardcoded values
const FORBIDDEN_PATTERNS = [
  // Hardcoded hex colors (except in design system files)
  {
    pattern: /#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/g,
    message: 'Hardcoded hex color found. Use design tokens instead.',
    excludeFiles: ['tokens.ts', 'theme.css', '.md']
  },
  // Hardcoded rgb/rgba values
  {
    pattern: /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+/gi,
    message: 'Hardcoded RGB color found. Use design tokens instead.',
    excludeFiles: ['tokens.ts', 'theme.css', '.md']
  },
  // Hardcoded pixel values for spacing (except small values like 1px, 2px for borders)
  {
    pattern: /(?<!border[^:]*:\s*)(?<!\d)\b([3-9]|[1-9]\d+)px\b(?!.*radius)/gi,
    message: 'Hardcoded pixel spacing found. Use Tailwind spacing classes.',
    excludeFiles: ['tokens.ts', 'theme.css', '.md', '.css']
  },
  // Hardcoded rem values
  {
    pattern: /(?<!\d)\d+(\.\d+)?rem\b/gi,
    message: 'Hardcoded rem value found. Use design tokens.',
    excludeFiles: ['tokens.ts', 'theme.css', '.md', '.css', 'globals.css']
  },
  // Inline styles with color
  {
    pattern: /style=\{[^}]*color\s*:/gi,
    message: 'Inline color style found. Use className with design tokens.',
    excludeFiles: ['.md']
  }
];

// Allowed exceptions (common patterns that are okay)
const ALLOWED_PATTERNS = [
  /100%/,        // Percentages are fine
  /0px/,         // Zero is fine
  /1px/,         // Border widths
  /2px/,         // Small borders
  /0\.5px/,      // Hairline borders
];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const violations = [];

  for (const rule of FORBIDDEN_PATTERNS) {
    // Skip if file is in exclude list
    if (rule.excludeFiles.some(exc => filePath.includes(exc))) {
      continue;
    }

    const matches = content.matchAll(rule.pattern);
    for (const match of matches) {
      // Skip if it's an allowed pattern
      if (ALLOWED_PATTERNS.some(allowed => allowed.test(match[0]))) {
        continue;
      }

      // Find line number
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;

      violations.push({
        file: filePath,
        line: lineNumber,
        match: match[0],
        message: rule.message
      });
    }
  }

  return violations;
}

function main() {
  const args = process.argv.slice(2);
  let filesToCheck = [];

  if (args.length > 0) {
    // Check specific files
    filesToCheck = args.filter(f => fs.existsSync(f));
  } else {
    // Check all src files
    const srcDir = path.join(process.cwd(), 'src');
    if (fs.existsSync(srcDir)) {
      filesToCheck = getAllFiles(srcDir).filter(f =>
        f.endsWith('.tsx') || f.endsWith('.ts')
      );
    }
  }

  let allViolations = [];

  for (const file of filesToCheck) {
    const violations = checkFile(file);
    allViolations = allViolations.concat(violations);
  }

  if (allViolations.length > 0) {
    console.error('\n❌ Design Token Violations Found:\n');
    for (const v of allViolations) {
      console.error(`  ${v.file}:${v.line}`);
      console.error(`    Found: "${v.match}"`);
      console.error(`    ${v.message}\n`);
    }
    console.error(`Total violations: ${allViolations.length}`);
    process.exit(1);
  } else {
    console.log('✅ No design token violations found');
    process.exit(0);
  }
}

function getAllFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && !item.name.startsWith('.')) {
      files.push(...getAllFiles(fullPath));
    } else if (item.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

main();
