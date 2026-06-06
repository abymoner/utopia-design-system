#!/usr/bin/env node

/**
 * Utopia Design System — Token Generator
 *
 * Usage:
 *   node generate-tokens.mjs <config.json>
 *   node generate-tokens.mjs --config '{"minWidth":320,"maxWidth":1440,...}'
 *   node generate-tokens.mjs                           # interactive mode
 *
 * Config structure and defaults:
 *   {
 *     "type": {                // optional — type scale config
 *       "minWidth": 375,
 *       "maxWidth": 1440,
 *       "minFontSize": 16,
 *       "maxFontSize": 20,
 *       "minTypeScale": 1.2,
 *       "maxTypeScale": 1.333,
 *       "negativeSteps": 2,
 *       "positiveSteps": 5,
 *       "relativeTo": "viewport-width",
 *       "labelStyle": "utopia"
 *     },
 *     "space": {               // optional — space scale config
 *       "minWidth": 375,
 *       "maxWidth": 1440,
 *       "minSize": 8,
 *       "maxSize": 12,
 *       "positiveSteps": [0.5, 1, 1.5, 2, 3, 4, 6],
 *       "negativeSteps": [0.25],
 *       "relativeTo": "viewport-width",
 *       "customSizes": ["xs-l"]
 *     },
 *     "sectionSpace": {        // optional — section spacing
 *       "positiveSteps": [1, 1.5, 2, 3, 4, 6],
 *       "negativeSteps": [0.5, 0.75]
 *     },
 *     "gutter": {              // optional — fluid gutter
 *       "minGutter": 16,
 *       "maxGutter": 80
 *     },
 *     "contentWidth": {        // optional — fluid max-width
 *       "minContent": 640,
 *       "maxContent": 1152
 *     },
 *     "enableCrossoverPairs": true,  // enable type crossover pairs
 *     "enableTextLabels": true,      // enable semantic text/heading aliases
 *     "enableHeadingPairs": true,    // enable heading crossover pairs
 *     "format": "css"           // "css" | "tailwind" | "scss" | "json"
 *   }
 */

import { readFileSync } from 'fs';
import {
  calculateTypeScale,
  calculateSpaceScale,
  calculateSectionSpaceScale,
  calculateTypeCrossoverPairs,
  calculateTextLabels,
  calculateHeadingLabels,
  calculateHeadingCrossoverPairs,
  calculateGutter,
  calculateContentWidth,
  calculateClamps
} from './calculate.mjs';

// ─── Scale name resolver ─────────────────────────────────────────────────────

const SCALES = JSON.parse(readFileSync(new URL('./scales.json', import.meta.url), 'utf-8'));

/**
 * Resolve a scale name or numeric value to a number.
 * @param {string|number} input  — e.g. "perfect-fourth", 1.333
 * @returns {number}
 */
export function resolveScale(input) {
  if (typeof input === 'number') return input;
  if (typeof input === 'string') {
    const numeric = parseFloat(input);
    if (!isNaN(numeric)) return numeric;
    const entry = SCALES[input.toLowerCase().replace(/\s+/g, '-')];
    if (entry && entry.value !== null) return entry.value;
  }
  throw new Error(`Unknown scale: "${input}". Use a numeric value or one of: ${Object.keys(SCALES).join(', ')}`);
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatCSS(opts) {
  const { typeSteps, spaceScale, sectionSpace, typePairs, textLabels, headingLabels, headingPairs, gutter, contentWidth, clamps } = opts;
  const lines = [':root {'];

  if (typeSteps && typeSteps.length) {
    lines.push('  /* ─── Fluid Type Scale ─── */');
    for (const s of typeSteps) {
      lines.push(`  --font-size-${s.label}: ${s.clamp};`);
    }
  }

  if (typePairs && typePairs.length) {
    lines.push('');
    lines.push('  /* ─── Type Crossover Pairs ─── */');
    for (const p of typePairs) {
      lines.push(`  --font-size-${p.label}: ${p.clamp};`);
    }
  }

  if (textLabels && textLabels.length) {
    lines.push('');
    lines.push('  /* ─── Semantic Text Sizes ─── */');
    for (const t of textLabels) {
      lines.push(`  --text-${t.label}: ${t.clamp};`);
    }
  }

  if (headingLabels && headingLabels.length) {
    lines.push('');
    lines.push('  /* ─── Semantic Heading Sizes ─── */');
    for (const h of headingLabels) {
      lines.push(`  --${h.label}: ${h.clamp};`);
    }
  }

  if (headingPairs && headingPairs.length) {
    lines.push('');
    lines.push('  /* ─── Heading Crossover Pairs ─── */');
    for (const p of headingPairs) {
      lines.push(`  --${p.label}: ${p.clamp};`);
    }
  }

  if (spaceScale && spaceScale.sizes.length) {
    lines.push('');
    lines.push('  /* ─── Fluid Space Scale ─── */');
    for (const size of spaceScale.sizes) {
      lines.push(`  --space-${size.label}: ${size.clamp};`);
    }
  }

  if (spaceScale && spaceScale.oneUpPairs.length) {
    lines.push('');
    lines.push('  /* ─── Space One-Up Pairs ─── */');
    for (const pair of spaceScale.oneUpPairs) {
      lines.push(`  --space-${pair.label}: ${pair.clamp};`);
    }
  }

  if (spaceScale && spaceScale.customPairs.length) {
    lines.push('');
    lines.push('  /* ─── Space Custom Pairs ─── */');
    for (const pair of spaceScale.customPairs) {
      lines.push(`  --space-${pair.label}: ${pair.clamp};`);
    }
  }

  if (sectionSpace && sectionSpace.sizes.length) {
    lines.push('');
    lines.push('  /* ─── Fluid Section Space Scale ─── */');
    for (const size of sectionSpace.sizes) {
      lines.push(`  --section-space-${size.label}: ${size.clamp};`);
    }
  }

  if (sectionSpace && sectionSpace.oneUpPairs.length) {
    lines.push('');
    lines.push('  /* ─── Section Space One-Up Pairs ─── */');
    for (const pair of sectionSpace.oneUpPairs) {
      lines.push(`  --section-space-${pair.label}: ${pair.clamp};`);
    }
  }

  if (gutter) {
    lines.push('');
    lines.push('  /* ─── Gutter ─── */');
    lines.push(`  --gutter: ${gutter.clamp};`);
  }

  if (contentWidth) {
    lines.push('');
    lines.push('  /* ─── Content Width ─── */');
    lines.push(`  --content-width: ${contentWidth.clamp};`);
    lines.push('  --content-width-safe: min(var(--content-width), calc(100% - var(--gutter) * 2));');
  }

  if (clamps && clamps.length) {
    lines.push('');
    lines.push('  /* ─── Custom Clamps ─── */');
    for (const c of clamps) {
      lines.push(`  --clamp-${c.label}: ${c.clamp};`);
    }
  }

  lines.push('}');
  return lines.join('\n');
}

function formatTailwind(opts) {
  const { typeSteps, spaceScale, sectionSpace, textLabels, headingLabels, gutter, contentWidth, clamps } = opts;
  const lines = [
    '/** @type {import("tailwindcss").Config} */',
    'module.exports = {',
    '  theme: {',
    '    extend: {'
  ];

  if (typeSteps && typeSteps.length) {
    lines.push('      // ─── Fluid Font Sizes ───');
    lines.push('      fontSize: {');
    for (const s of typeSteps) {
      lines.push(`        '${s.label}': '${s.clamp}',`);
    }
    if (textLabels) {
      for (const t of textLabels) {
        lines.push(`        '${t.label}': '${t.clamp}',`);
      }
    }
    if (headingLabels) {
      for (const h of headingLabels) {
        lines.push(`        '${h.label}': '${h.clamp}',`);
      }
    }
    lines.push('      },');
  }

  if (spaceScale && spaceScale.sizes.length) {
    lines.push('      // ─── Fluid Spacing ───');
    lines.push('      spacing: {');
    for (const size of spaceScale.sizes) {
      lines.push(`        '${size.label}': '${size.clamp}',`);
    }
    for (const pair of spaceScale.oneUpPairs) {
      lines.push(`        '${pair.label}': '${pair.clamp}',`);
    }
    for (const pair of spaceScale.customPairs) {
      lines.push(`        '${pair.label}': '${pair.clamp}',`);
    }
    if (sectionSpace && sectionSpace.sizes.length) {
      for (const size of sectionSpace.sizes) {
        lines.push(`        'section-${size.label}': '${size.clamp}',`);
      }
      for (const pair of sectionSpace.oneUpPairs) {
        lines.push(`        'section-${pair.label}': '${pair.clamp}',`);
      }
    }
    if (gutter) lines.push(`        'gutter': '${gutter.clamp}',`);
    if (contentWidth) lines.push(`        'content': '${contentWidth.clamp}',`);
    lines.push('      },');
  }

  lines.push('    }');
  lines.push('  }');
  lines.push('};');
  return lines.join('\n');
}

function formatSCSS(opts) {
  const { typeSteps, spaceScale, sectionSpace, typePairs, textLabels, headingLabels, headingPairs, gutter, contentWidth, clamps } = opts;
  const lines = [
    '// ─── Fluid Design System ───',
    '// Auto-generated by utopia-design-system',
  ];

  if (typeSteps && typeSteps.length) {
    lines.push('', '// =========================================', '// Type Scale', '// =========================================', '');
    for (const s of typeSteps) {
      lines.push(`$font-size-${s.label}: ${s.clamp};`);
    }
  }

  if (typePairs && typePairs.length) {
    lines.push('', '// =========================================', '// Type Crossover Pairs', '// =========================================', '');
    for (const p of typePairs) {
      lines.push(`$font-size-${p.label}: ${p.clamp};`);
    }
  }

  if (textLabels && textLabels.length) {
    lines.push('', '// =========================================', '// Semantic Text Sizes', '// =========================================', '');
    for (const t of textLabels) {
      lines.push(`$text-${t.label}: ${t.clamp};`);
    }
  }

  if (headingLabels && headingLabels.length) {
    lines.push('', '// =========================================', '// Semantic Heading Sizes', '// =========================================', '');
    for (const h of headingLabels) {
      lines.push(`$${h.label}: ${h.clamp};`);
    }
  }

  if (headingPairs && headingPairs.length) {
    lines.push('', '// =========================================', '// Heading Crossover Pairs', '// =========================================', '');
    for (const p of headingPairs) {
      lines.push(`$${p.label}: ${p.clamp};`);
    }
  }

  if (spaceScale && spaceScale.sizes.length) {
    lines.push('', '// =========================================', '// Space Scale', '// =========================================', '');
    for (const size of spaceScale.sizes) {
      lines.push(`$space-${size.label}: ${size.clamp};`);
    }
    for (const pair of spaceScale.oneUpPairs) {
      lines.push(`$space-${pair.label}: ${pair.clamp};`);
    }
    for (const pair of spaceScale.customPairs) {
      lines.push(`$space-${pair.label}: ${pair.clamp};`);
    }
  }

  if (sectionSpace && sectionSpace.sizes.length) {
    lines.push('', '// =========================================', '// Section Space Scale', '// =========================================', '');
    for (const size of sectionSpace.sizes) {
      lines.push(`$section-space-${size.label}: ${size.clamp};`);
    }
    for (const pair of sectionSpace.oneUpPairs) {
      lines.push(`$section-space-${pair.label}: ${pair.clamp};`);
    }
  }

  if (gutter) {
    lines.push('', '// =========================================', '// Gutter', '// =========================================', '');
    lines.push(`$gutter: ${gutter.clamp};`);
  }

  if (contentWidth) {
    lines.push('', '// =========================================', '// Content Width', '// =========================================', '');
    lines.push(`$content-width: ${contentWidth.clamp};`);
  }

  if (clamps && clamps.length) {
    lines.push('', '// =========================================', '// Custom Clamps', '// =========================================', '');
    for (const c of clamps) {
      lines.push(`$clamp-${c.label}: ${c.clamp};`);
    }
  }

  return lines.join('\n');
}

function formatJSON(data) {
  return JSON.stringify(data, null, 2);
}

// ─── Interactive Prompts ─────────────────────────────────────────────────────

async function interact() {
  const { createInterface } = await import('readline');
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise(r => rl.question(q, r));

  console.log('\n  Utopia Design System Generator\n');

  const scaleNames = Object.entries(SCALES).filter(([k, v]) => v.value !== null);
  console.log('Available scales:');
  for (const [k, v] of scaleNames) {
    console.log(`  ${k.padEnd(20)} ${v.value}  — ${v.description}`);
  }
  console.log();

  const rawScale = await ask('Type scale (e.g. "perfect-fourth" or a number like 1.333): ');
  const singleScale = await ask('Use same scale for min/max? (Y/n): ');
  const typeScaleValue = resolveScale(rawScale.trim());
  let maxTypeScale = typeScaleValue;

  if (singleScale.toLowerCase().startsWith('n')) {
    const rawMax = await ask('Max viewport type scale: ');
    maxTypeScale = resolveScale(rawMax.trim());
  }

  const minW = parseFloat(await ask('Min viewport width (px) [375]: ') || '375');
  const maxW = parseFloat(await ask('Max viewport width (px) [1440]: ') || '1440');
  const minFS = parseFloat(await ask('Min font size (px) [16]: ') || '16');
  const maxFS = parseFloat(await ask('Max font size (px) [20]: ') || '20');
  const neg = parseInt(await ask('Negative type steps [2]: ') || '2');
  const pos = parseInt(await ask('Positive type steps [5]: ') || '5');

  const doSpace = (await ask('Generate space scale? (Y/n): ') || 'y').toLowerCase();
  let spaceConfig = null;

  if (doSpace.startsWith('y')) {
    const spaceMin = parseFloat(await ask('Space base min (px) [8]: ') || '8');
    const spaceMax = parseFloat(await ask('Space base max (px) [12]: ') || '12');
    spaceConfig = {
      minWidth: minW, maxWidth: maxW,
      minSize: spaceMin, maxSize: spaceMax,
      positiveSteps: [1.5, 2, 3, 4, 6],
      negativeSteps: [0.5, 0.75],
      relativeTo: 'viewport-width'
    };
  }

  const doSection = (await ask('Generate section space scale? (Y/n): ') || 'y').toLowerCase();

  const doGutter = (await ask('Generate fluid gutter? (Y/n): ') || 'y').toLowerCase();
  let gutterConfig = null;
  if (doGutter.startsWith('y')) {
    const minG = parseFloat(await ask('Gutter at min viewport (px) [16]: ') || '16');
    const maxG = parseFloat(await ask('Gutter at max viewport (px) [80]: ') || '80');
    gutterConfig = { minGutter: minG, maxGutter: maxG };
  }

  const doContent = (await ask('Generate fluid content width? (Y/n): ') || 'y').toLowerCase();
  let contentConfig = null;
  if (doContent.startsWith('y')) {
    const minC = parseFloat(await ask('Content width at min viewport (px) [640]: ') || '640');
    const maxC = parseFloat(await ask('Content width at max viewport (px) [1152]: ') || '1152');
    contentConfig = { minContent: minC, maxContent: maxC };
  }

  const format = (await ask('Output format (css/tailwind/scss/json) [css]: ') || 'css').toLowerCase();

  rl.close();

  const config = {
    type: {
      minWidth: minW, maxWidth: maxW,
      minFontSize: minFS, maxFontSize: maxFS,
      minTypeScale: typeScaleValue, maxTypeScale,
      negativeSteps: neg, positiveSteps: pos,
      relativeTo: 'viewport-width', labelStyle: 'utopia'
    },
    enableCrossoverPairs: true,
    enableTextLabels: true,
    enableHeadingPairs: true,
    format
  };

  if (spaceConfig) config.space = spaceConfig;
  if (doSection.startsWith('y')) config.sectionSpace = {};
  if (gutterConfig) config.gutter = gutterConfig;
  if (contentConfig) config.contentWidth = contentConfig;

  return config;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  let config;

  if (process.argv[2]) {
    const arg = process.argv[2];
    if (arg.startsWith('{')) {
      config = JSON.parse(arg);
    } else if (arg.startsWith('--config=')) {
      config = JSON.parse(arg.slice(9));
    } else {
      config = JSON.parse(readFileSync(arg, 'utf-8'));
    }
  } else {
    config = await interact();
  }

  // Resolve scale names and apply defaults to type config
  if (config.type) {
    config.type.minTypeScale = resolveScale(config.type.minTypeScale ?? 1.2);
    config.type.maxTypeScale = resolveScale(config.type.maxTypeScale ?? config.type.minTypeScale);
    config.type.minWidth ??= 375;
    config.type.maxWidth ??= 1440;
    config.type.minFontSize ??= 16;
    config.type.maxFontSize ??= 20;
    config.type.negativeSteps ??= 2;
    config.type.positiveSteps ??= 5;
    config.type.relativeTo ??= 'viewport-width';
    config.type.labelStyle ??= 'utopia';
  }

  const minWidth = config.type?.minWidth ?? config.minWidth ?? 375;
  const maxWidth = config.type?.maxWidth ?? config.maxWidth ?? 1440;
  const relativeTo = config.type?.relativeTo ?? config.relativeTo ?? 'viewport-width';

  // Apply defaults to space config
  if (config.space) {
    config.space.positiveSteps ??= [1.5, 2, 3, 4, 6];
    config.space.negativeSteps ??= [0.5, 0.75];
    config.space.minWidth ??= minWidth;
    config.space.maxWidth ??= maxWidth;
    config.space.relativeTo ??= relativeTo;
  }

  // Apply defaults to section space config
  if (config.sectionSpace) {
    config.sectionSpace.minWidth ??= minWidth;
    config.sectionSpace.maxWidth ??= maxWidth;
    config.sectionSpace.relativeTo ??= relativeTo;
    config.sectionSpace.minSize ??= config.space?.minSize ?? 8;
    config.sectionSpace.maxSize ??= config.space?.maxSize ?? 12;
  }

  // Apply defaults to gutter config
  if (config.gutter) {
    config.gutter.minWidth ??= minWidth;
    config.gutter.maxWidth ??= maxWidth;
    config.gutter.relativeTo ??= relativeTo;
    config.gutter.minGutter ??= 16;
    config.gutter.maxGutter ??= 80;
  }

  // Apply defaults to content width config
  if (config.contentWidth) {
    config.contentWidth.minWidth ??= minWidth;
    config.contentWidth.maxWidth ??= maxWidth;
    config.contentWidth.relativeTo ??= relativeTo;
    config.contentWidth.minContent ??= 640;
    config.contentWidth.maxContent ??= 1152;
  }

  // Calculate everything
  const typeSteps = config.type ? calculateTypeScale(config.type) : null;
  const spaceScale = config.space ? calculateSpaceScale(config.space) : null;
  const sectionSpace = config.sectionSpace ? calculateSectionSpaceScale(config.sectionSpace) : null;

  const typePairs = (typeSteps && config.enableCrossoverPairs !== false)
    ? calculateTypeCrossoverPairs(typeSteps, minWidth, maxWidth, relativeTo)
    : null;

  const textLabels = (typeSteps && config.enableTextLabels !== false)
    ? calculateTextLabels(typeSteps)
    : null;

  const headingLabels = (typeSteps && config.enableTextLabels !== false)
    ? calculateHeadingLabels(typeSteps)
    : null;

  const headingPairs = (headingLabels && config.enableHeadingPairs !== false)
    ? calculateHeadingCrossoverPairs(headingLabels, minWidth, maxWidth, relativeTo)
    : null;

  const gutter = config.gutter ? calculateGutter(config.gutter) : null;
  const contentWidth = config.contentWidth ? calculateContentWidth(config.contentWidth) : null;

  const customClamps = config.clamps
    ? calculateClamps({ ...config.clamps, pairs: config.clamps.pairs })
    : null;

  // Format output
  const format = config.format || 'css';
  const data = { typeSteps, spaceScale, sectionSpace, typePairs, textLabels, headingLabels, headingPairs, gutter, contentWidth, clamps: customClamps };
  let output;
  switch (format) {
    case 'tailwind': output = formatTailwind(data); break;
    case 'scss':     output = formatSCSS(data);     break;
    case 'json':     output = formatJSON(data);     break;
    default:         output = formatCSS(data);       break;
  }

  process.stdout.write(output + '\n');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
