/**
 * Utopia Fluid Calculator
 *
 * Core math for fluid type scales and space scales.
 * Ported from the Utopia project by James Gilyead & Trys Mudford.
 * @see https://utopia.fyi
 */

// ─── Types (JSDoc) ───────────────────────────────────────────────────────────

/** @typedef {'viewport' | 'container' | 'viewport-width'} RelativeTo */
/** @typedef {'utopia' | 'tailwind' | 'tshirt'} LabelStyle */

/**
 * @typedef {Object} TypeConfig
 * @property {number} minWidth
 * @property {number} maxWidth
 * @property {number} minFontSize
 * @property {number} maxFontSize
 * @property {number} minTypeScale
 * @property {number} maxTypeScale
 * @property {number} [negativeSteps]
 * @property {number} [positiveSteps]
 * @property {RelativeTo} [relativeTo]
 * @property {LabelStyle} [labelStyle]
 */

/**
 * @typedef {Object} Step
 * @property {number} step
 * @property {string} label
 * @property {number} minFontSize
 * @property {number} maxFontSize
 * @property {{from:number, to:number}|null} [wcagViolation]
 * @property {string} clamp
 */

/**
 * @typedef {Object} SpaceConfig
 * @property {number} minWidth
 * @property {number} maxWidth
 * @property {number} minSize
 * @property {number} maxSize
 * @property {number[]} [negativeSteps]
 * @property {number[]} [positiveSteps]
 * @property {string[]} [customSizes]
 * @property {RelativeTo} [relativeTo]
 */

/**
 * @typedef {Object} Size
 * @property {string} label
 * @property {number} minSize
 * @property {number} maxSize
 * @property {string} clamp
 * @property {string} clampPx
 * @property {number} multiplier
 */

/**
 * @typedef {Object} SpaceScale
 * @property {Size[]} sizes
 * @property {Size[]} oneUpPairs
 * @property {Size[]} customPairs
 */

/**
 * @typedef {Object} ClampResult
 * @property {string} label
 * @property {string} clamp
 * @property {string} clampPx
 */

/**
 * @typedef {Object} SectionSpaceConfig
 * @property {number} minWidth
 * @property {number} maxWidth
 * @property {number} minSize
 * @property {number} maxSize
 * @property {number[]} [negativeSteps]
 * @property {number[]} [positiveSteps]
 * @property {RelativeTo} [relativeTo]
 */

/**
 * @typedef {Object} FluidProperty
 * @property {string} label
 * @property {string} clamp
 */

/**
 * @typedef {Object} CrossoverPair
 * @property {string} label
 * @property {number} minSize
 * @property {number} maxSize
 * @property {string} clamp
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));
const round = (n) => Math.round((n + Number.EPSILON) * 10000) / 10000;
const sortAsc = (a, b) => Number(a) - Number(b);

// ─── Clamp ───────────────────────────────────────────────────────────────────

/**
 * Calculate a single fluid clamp() value.
 * @param {Object} opts
 * @param {number} opts.minSize
 * @param {number} opts.maxSize
 * @param {number} opts.minWidth
 * @param {number} opts.maxWidth
 * @param {boolean} [opts.usePx=false]
 * @param {RelativeTo} [opts.relativeTo='viewport-width']
 * @returns {string}
 */
export function calculateClamp(opts) {
  const {
    minSize,
    maxSize,
    minWidth,
    maxWidth,
    usePx = false,
    relativeTo = 'viewport-width'
  } = opts;

  const isNegative = minSize > maxSize;
  const mn = isNegative ? maxSize : minSize;
  const mx = isNegative ? minSize : maxSize;

  const divider = usePx ? 1 : 16;
  const unit = usePx ? 'px' : 'rem';
  const relativeUnits = {
    viewport: 'vi',
    'viewport-width': 'vw',
    container: 'cqi'
  };
  const relUnit = relativeUnits[relativeTo] || relativeUnits['viewport-width'];

  const slope = ((mx / divider) - (mn / divider)) / ((maxWidth / divider) - (minWidth / divider));
  const intersection = (-1 * (minWidth / divider)) * slope + (mn / divider);
  return `clamp(${round(mn / divider)}${unit}, ${round(intersection)}${unit} + ${round(slope * 100)}${relUnit}, ${round(mx / divider)}${unit})`;
}

/**
 * Check WCAG 1.4.4 compliance for fluid type.
 * Returns a failure range [from, to] in px, or null if compliant.
 *
 * Thanks to Maxwell Barvian (fluid.style) for the calculation.
 *
 * @param {Object} opts
 * @param {number} opts.min
 * @param {number} opts.max
 * @param {number} opts.minWidth
 * @param {number} opts.maxWidth
 * @returns {number[]|null}
 */
export function checkWCAG(opts) {
  let { min, max, minWidth, maxWidth } = opts;

  if (minWidth > maxWidth) {
    const tmpW = minWidth; minWidth = maxWidth; maxWidth = tmpW;
    const tmpM = min; min = max; max = tmpM;
  }

  const slope = (max - min) / (maxWidth - minWidth);
  const intercept = min - (minWidth * slope);
  const lh = (5 * min - 2 * intercept) / (2 * slope);
  const rh = (5 * intercept - 2 * max) / (-1 * slope);
  const lh2 = (3 * intercept) / slope;

  let failRange = [];

  if (maxWidth < 5 * minWidth) {
    if (minWidth < lh && lh < maxWidth) failRange.push(Math.max(lh, minWidth), maxWidth);
    if (5 * min < 2 * max) failRange.push(maxWidth, 5 * minWidth);
    if (5 * minWidth < rh && rh < 5 * maxWidth) failRange.push(5 * minWidth, Math.min(rh, 5 * maxWidth));
  } else {
    if (minWidth < lh && lh < 5 * minWidth) failRange.push(Math.max(lh, minWidth), 5 * minWidth);
    if (5 * minWidth < lh2 && lh2 < maxWidth) failRange.push(Math.max(lh2, 5 * minWidth), maxWidth);
    if (maxWidth < rh && rh < 5 * maxWidth) failRange.push(maxWidth, Math.min(rh, 5 * maxWidth));
  }

  if (failRange.length) {
    failRange = [failRange[0], failRange[failRange.length - 1]];
    if (Math.abs(failRange[1] - failRange[0]) < 0.1) return null;
  }

  return failRange.length ? failRange : null;
}

/**
 * Calculate multiple clamps from a list of [minSize, maxSize] pairs.
 * @param {Object} opts
 * @param {number} opts.minWidth
 * @param {number} opts.maxWidth
 * @param {[number,number][]} opts.pairs
 * @param {RelativeTo} [opts.relativeTo]
 * @returns {ClampResult[]}
 */
export function calculateClamps(opts) {
  const { minWidth, maxWidth, pairs = [], relativeTo } = opts;
  return pairs.map(([minSize, maxSize]) => ({
    label: `${minSize}-${maxSize}`,
    clamp: calculateClamp({ minSize, maxSize, minWidth, maxWidth, relativeTo }),
    clampPx: calculateClamp({ minSize, maxSize, minWidth, maxWidth, relativeTo, usePx: true })
  }));
}

// ─── Type Scale ────────────────────────────────────────────────────────────────

function calcTypeSize(config, viewport, step) {
  const scale = range(config.minWidth, config.maxWidth, config.minTypeScale, config.maxTypeScale, viewport);
  const fontSize = range(config.minWidth, config.maxWidth, config.minFontSize, config.maxFontSize, viewport);
  return fontSize * Math.pow(scale, step);
}

function stepLabel(step, labelGroup = 'utopia') {
  if (labelGroup === 'utopia') return String(step);

  if (step < -2) return `${-1 * (step + 1)}xs`;
  if (step === -2) return 'xs';

  if (labelGroup === 'tailwind') {
    if (step === -1) return 'sm';
    if (step === 0) return 'base';
    if (step === 1) return 'lg';
  }

  if (labelGroup === 'tshirt') {
    if (step === -1) return 's';
    if (step === 0) return 'm';
    if (step === 1) return 'l';
  }

  if (step === 2) return 'xl';
  if (step > 2) return `${step - 1}xl`;
  return String(step);
}

function calcTypeStep(config, step) {
  const minFontSize = calcTypeSize(config, config.minWidth, step);
  const maxFontSize = calcTypeSize(config, config.maxWidth, step);
  const wcag = checkWCAG({ min: minFontSize, max: maxFontSize, minWidth: config.minWidth, maxWidth: config.maxWidth });

  return {
    step,
    label: stepLabel(step, config.labelStyle),
    minFontSize: round(minFontSize),
    maxFontSize: round(maxFontSize),
    wcagViolation: wcag && wcag.length
      ? { from: Math.round(wcag[0]), to: Math.round(wcag[1]) }
      : null,
    clamp: calculateClamp({
      minSize: minFontSize,
      maxSize: maxFontSize,
      minWidth: config.minWidth,
      maxWidth: config.maxWidth,
      relativeTo: config.relativeTo
    })
  };
}

/**
 * Calculate a complete fluid type scale.
 * @param {TypeConfig} config
 * @returns {Step[]}
 */
export function calculateTypeScale(config) {
  const positiveSteps = Array.from({ length: config.positiveSteps || 0 })
    .map((_, i) => calcTypeStep(config, i + 1)).reverse();

  const negativeSteps = Array.from({ length: config.negativeSteps || 0 })
    .map((_, i) => calcTypeStep(config, -1 * (i + 1)));

  return [
    ...positiveSteps,
    calcTypeStep(config, 0),
    ...negativeSteps
  ];
}

// ─── Space Label Helpers ──────────────────────────────────────────────────────

const SPACE_LABELS = [
  { max: 0.125, label: '3xs' },
  { max: 0.25, label: '2xs' },
  { max: 0.5, label: 'xs' },
  { max: 0.75, label: 's' },
  { max: 1, label: 'm' },
  { max: 1.5, label: 'l' },
  { max: 2, label: 'xl' },
  { max: 3, label: '2xl' },
  { max: 4, label: '3xl' },
  { max: 6, label: '4xl' },
  { max: Infinity, label: '5xl' }
];

function spaceLabel(multiplier) {
  for (const entry of SPACE_LABELS) {
    if (multiplier <= entry.max) return entry.label;
  }
  return String(Math.round(multiplier));
}

// ─── Space Scale ────────────────────────────────────────────────────────────────

function calcSpaceSize(config, multiplier) {
  const minSize = Math.round(config.minSize * multiplier);
  const maxSize = Math.round(config.maxSize * multiplier);
  const label = spaceLabel(multiplier);

  return {
    label,
    minSize: round(minSize),
    maxSize: round(maxSize),
    multiplier,
    clamp: calculateClamp({
      minSize, maxSize,
      minWidth: config.minWidth,
      maxWidth: config.maxWidth,
      relativeTo: config.relativeTo
    }),
    clampPx: calculateClamp({
      minSize, maxSize,
      minWidth: config.minWidth,
      maxWidth: config.maxWidth,
      relativeTo: config.relativeTo,
      usePx: true
    })
  };
}

function calcOneUpPairs(config, sizes) {
  const reversed = [...sizes].reverse();
  return reversed.map((size, i, arr) => {
    if (!i) return null;
    const prev = arr[i - 1];
    return {
      label: `${prev.label}-${size.label}`,
      minSize: prev.minSize,
      maxSize: size.maxSize,
      clamp: calculateClamp({
        minSize: prev.minSize, maxSize: size.maxSize,
        minWidth: config.minWidth, maxWidth: config.maxWidth,
        relativeTo: config.relativeTo
      }),
      clampPx: calculateClamp({
        minSize: prev.minSize, maxSize: size.maxSize,
        minWidth: config.minWidth, maxWidth: config.maxWidth,
        relativeTo: config.relativeTo, usePx: true
      })
    };
  }).filter(Boolean);
}

function calcCustomPairs(config, sizes) {
  return (config.customSizes || []).map((label) => {
    const [keyA, keyB] = label.split('-');
    if (!keyA || !keyB) return null;

    const a = sizes.find(x => x.label === keyA);
    const b = sizes.find(x => x.label === keyB);
    if (!a || !b) return null;

    return {
      label: `${keyA}-${keyB}`,
      minSize: a.minSize,
      maxSize: b.maxSize,
      clamp: calculateClamp({
        minWidth: config.minWidth, maxWidth: config.maxWidth,
        minSize: a.minSize, maxSize: b.maxSize,
        relativeTo: config.relativeTo
      }),
      clampPx: calculateClamp({
        minWidth: config.minWidth, maxWidth: config.maxWidth,
        minSize: a.minSize, maxSize: b.maxSize,
        relativeTo: config.relativeTo, usePx: true
      })
    };
  }).filter(Boolean);
}

/**
 * Calculate a complete fluid space scale.
 * @param {SpaceConfig} config
 * @returns {SpaceScale}
 */
export function calculateSpaceScale(config) {
  const positiveSteps = [...(config.positiveSteps || [])].sort(sortAsc)
    .map(multiplier => calcSpaceSize(config, multiplier)).reverse();

  const negativeSteps = [...(config.negativeSteps || [])].sort(sortAsc).reverse()
    .map(multiplier => calcSpaceSize(config, multiplier));

  const sizes = [
    ...positiveSteps,
    calcSpaceSize(config, 1),
    ...negativeSteps
  ];

  return {
    sizes,
    oneUpPairs: calcOneUpPairs(config, sizes),
    customPairs: calcCustomPairs(config, sizes)
  };
}

// ─── Section Space Scale ───────────────────────────────────────────────────────

const DEFAULT_SECTION_MULTIPLIERS = [1.5, 2, 3, 4, 6];
const DEFAULT_SECTION_NEGATIVE = [0.5, 0.75];

/**
 * Calculate a fluid section space scale (for padding/margin of sections).
 * Reuses space math with larger default multipliers.
 * @param {SectionSpaceConfig} config
 * @returns {SpaceScale}
 */
export function calculateSectionSpaceScale(config) {
  return calculateSpaceScale({
    ...config,
    positiveSteps: config.positiveSteps || DEFAULT_SECTION_MULTIPLIERS,
    negativeSteps: config.negativeSteps || DEFAULT_SECTION_NEGATIVE
  });
}

// ─── Type Crossover Pairs ─────────────────────────────────────────────────────

/**
 * Generate crossover pairs between adjacent type steps.
 * Each pair creates a fluid value between two steps.
 * @param {Step[]} steps  — sorted largest to smallest
 * @param {number} minWidth
 * @param {number} maxWidth
 * @param {RelativeTo} [relativeTo]
 * @returns {CrossoverPair[]}
 */
export function calculateTypeCrossoverPairs(steps, minWidth, maxWidth, relativeTo) {
  const pairs = [];
  for (let i = 0; i < steps.length - 1; i++) {
    const a = steps[i];
    const b = steps[i + 1];
    pairs.push({
      label: `${a.label}-to-${b.label}`,
      minSize: Math.min(a.minFontSize, b.minFontSize),
      maxSize: Math.max(a.maxFontSize, b.maxFontSize),
      clamp: calculateClamp({
        minSize: Math.min(a.minFontSize, b.minFontSize),
        maxSize: Math.max(a.maxFontSize, b.maxFontSize),
        minWidth, maxWidth, relativeTo
      })
    });
  }
  return pairs;
}

// ─── Semantic Type Aliases ─────────────────────────────────────────────────────

const TEXT_LABEL_MAP = [
  { step: -2, label: 'xs' },
  { step: -1, label: 's' },
  { step: 0, label: 'm' },
  { step: 1, label: 'l' },
  { step: 2, label: 'xl' },
  { step: 3, label: 'xxl' }
];

const HEADING_LABEL_MAP = [
  { step: -1, label: 'h6' },
  { step: 0, label: 'h5' },
  { step: 1, label: 'h4' },
  { step: 2, label: 'h3' },
  { step: 3, label: 'h2' },
  { step: 4, label: 'h1' }
];

/**
 * Generate semantic text size aliases from type scale steps.
 * Maps steps to --text-{xs,s,m,l,xl,xxl} values.
 * @param {Step[]} steps
 * @returns {FluidProperty[]}
 */
export function calculateTextLabels(steps) {
  const stepMap = {};
  for (const s of steps) stepMap[s.step] = s;
  return TEXT_LABEL_MAP
    .filter(entry => stepMap[entry.step])
    .map(entry => ({
      label: entry.label,
      clamp: stepMap[entry.step].clamp,
      minFontSize: stepMap[entry.step].minFontSize,
      maxFontSize: stepMap[entry.step].maxFontSize
    }));
}

/**
 * Generate semantic heading size aliases from type scale steps.
 * Maps steps to --h1 through --h6 values.
 * @param {Step[]} steps
 * @returns {FluidProperty[]}
 */
export function calculateHeadingLabels(steps) {
  const stepMap = {};
  for (const s of steps) stepMap[s.step] = s;
  return HEADING_LABEL_MAP
    .filter(entry => stepMap[entry.step])
    .map(entry => ({
      label: entry.label,
      clamp: stepMap[entry.step].clamp,
      minFontSize: stepMap[entry.step].minFontSize,
      maxFontSize: stepMap[entry.step].maxFontSize
    }));
}

/**
 * Generate crossover pairs between semantic heading sizes.
 * @param {FluidProperty[]} headings
 * @param {number} minWidth
 * @param {number} maxWidth
 * @param {RelativeTo} [relativeTo]
 * @returns {CrossoverPair[]}
 */
export function calculateHeadingCrossoverPairs(headings, minWidth, maxWidth, relativeTo) {
  const pairs = [];
  for (let i = 0; i < headings.length - 1; i++) {
    const a = headings[i];
    const b = headings[i + 1];
    pairs.push({
      label: `${a.label}-to-${b.label}`,
      clamp: calculateClamp({
        minSize: Math.min(a.minFontSize, b.minFontSize),
        maxSize: Math.max(a.maxFontSize, b.maxFontSize),
        minWidth, maxWidth, relativeTo
      })
    });
  }
  return pairs;
}

// ─── Utility Fluid Properties ─────────────────────────────────────────────────

/**
 * Calculate a fluid gutter (page margin) value.
 * @param {Object} config
 * @param {number} config.minWidth
 * @param {number} config.maxWidth
 * @param {number} config.minGutter  — gutter at min viewport (px), default 16
 * @param {number} config.maxGutter  — gutter at max viewport (px), default 80
 * @param {RelativeTo} [config.relativeTo]
 * @returns {FluidProperty}
 */
export function calculateGutter(config) {
  const { minWidth, maxWidth, minGutter = 16, maxGutter = 80, relativeTo } = config;
  return {
    label: 'gutter',
    clamp: calculateClamp({ minSize: minGutter, maxSize: maxGutter, minWidth, maxWidth, relativeTo })
  };
}

/**
 * Calculate a fluid content max-width value.
 * @param {Object} config
 * @param {number} config.minWidth
 * @param {number} config.maxWidth
 * @param {number} config.minContent  — content width at min viewport (px), default 640
 * @param {number} config.maxContent  — content width at max viewport (px), default 1152
 * @param {RelativeTo} [config.relativeTo]
 * @returns {FluidProperty}
 */
export function calculateContentWidth(config) {
  const { minWidth, maxWidth, minContent = 640, maxContent = 1152, relativeTo } = config;
  return {
    label: 'content-width',
    clamp: calculateClamp({ minSize: minContent, maxSize: maxContent, minWidth, maxWidth, relativeTo })
  };
}
