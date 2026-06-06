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

// ─── Space Scale ────────────────────────────────────────────────────────────────

function calcSpaceSize(config, multiplier, step) {
  const minSize = Math.round(config.minSize * multiplier);
  const maxSize = Math.round(config.maxSize * multiplier);

  let label = 's';
  if (step === 1) label = 'm';
  else if (step === 2) label = 'l';
  else if (step === 3) label = 'xl';
  else if (step > 3) label = `${step - 2}xl`;
  else if (step === -1) label = 'xs';
  else if (step < -1) label = `${Math.abs(step)}xs`;

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
    .map((multiplier, i) => calcSpaceSize(config, multiplier, i + 1)).reverse();

  const negativeSteps = [...(config.negativeSteps || [])].sort(sortAsc).reverse()
    .map((multiplier, i) => calcSpaceSize(config, multiplier, -1 * (i + 1)));

  const sizes = [
    ...positiveSteps,
    calcSpaceSize(config, 1, 0),
    ...negativeSteps
  ];

  return {
    sizes,
    oneUpPairs: calcOneUpPairs(config, sizes),
    customPairs: calcCustomPairs(config, sizes)
  };
}
