/** @type {import("tailwindcss").Config} */
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'xs':  'clamp(0.64rem, 0.45rem + 0.93vw, 1.11rem)',
        'sm':  'clamp(0.80rem, 0.61rem + 0.93vw, 1.33rem)',
        'base':'clamp(1.00rem, 0.83rem + 0.87vw, 1.50rem)',
        'lg':  'clamp(1.25rem, 1.08rem + 0.84vw, 1.80rem)',
        'xl':  'clamp(1.56rem, 1.39rem + 0.85vw, 2.17rem)',
        '2xl': 'clamp(1.95rem, 1.78rem + 0.85vw, 2.60rem)',
        '3xl': 'clamp(2.44rem, 2.27rem + 0.84vw, 3.12rem)',
        '4xl': 'clamp(3.05rem, 2.82rem + 1.14vw, 3.75rem)',
      },
      spacing: {
        '3xs': 'clamp(0.19rem, 0.08rem + 0.52vw, 0.50rem)',
        '2xs': 'clamp(0.38rem, 0.25rem + 0.61vw, 0.75rem)',
        'xs':  'clamp(0.56rem, 0.42rem + 0.70vw, 1.00rem)',
        's':   'clamp(0.75rem, 0.58rem + 0.87vw, 1.25rem)',
        'm':   'clamp(1.00rem, 0.83rem + 0.87vw, 1.50rem)',
        'l':   'clamp(1.50rem, 1.25rem + 1.30vw, 2.25rem)',
        'xl':  'clamp(2.00rem, 1.65rem + 1.74vw, 3.00rem)',
        '2xl': 'clamp(3.00rem, 2.48rem + 2.61vw, 4.50rem)',
        '3xl': 'clamp(4.00rem, 3.31rem + 3.48vw, 6.00rem)',
      },
      gap: {
        '3xs': 'clamp(0.19rem, 0.08rem + 0.52vw, 0.50rem)',
        '2xs': 'clamp(0.38rem, 0.25rem + 0.61vw, 0.75rem)',
        'xs':  'clamp(0.56rem, 0.42rem + 0.70vw, 1.00rem)',
        's':   'clamp(0.75rem, 0.58rem + 0.87vw, 1.25rem)',
        'm':   'clamp(1.00rem, 0.83rem + 0.87vw, 1.50rem)',
        'l':   'clamp(1.50rem, 1.25rem + 1.30vw, 2.25rem)',
        'xl':  'clamp(2.00rem, 1.65rem + 1.74vw, 3.00rem)',
        '2xl': 'clamp(3.00rem, 2.48rem + 2.61vw, 4.50rem)',
        '3xl': 'clamp(4.00rem, 3.31rem + 3.48vw, 6.00rem)',
      },
    },
  },
};
