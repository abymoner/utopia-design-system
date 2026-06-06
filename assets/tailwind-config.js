/** @type {import("tailwindcss").Config} */
module.exports = {
  theme: {
    extend: {
      // ─── Fluid Font Sizes ───
      fontSize: {
        '5': 'clamp(4.2087rem, 3.8382rem + 1.5807vw, 5.2609rem)',
        '4': 'clamp(3.1573rem, 2.8794rem + 1.1859vw, 3.9467rem)',
        '3': 'clamp(2.3686rem, 2.1601rem + 0.8896vw, 2.9607rem)',
        '2': 'clamp(1.7769rem, 1.6205rem + 0.6674vw, 2.2211rem)',
        '1': 'clamp(1.333rem, 1.2157rem + 0.5007vw, 1.6663rem)',
        '0': 'clamp(1rem, 0.912rem + 0.3756vw, 1.25rem)',
        '-1': 'clamp(0.7502rem, 0.6841rem + 0.2818vw, 0.9377rem)',
        '-2': 'clamp(0.5628rem, 0.5132rem + 0.2114vw, 0.7035rem)',
        'xs': 'clamp(0.5628rem, 0.5132rem + 0.2114vw, 0.7035rem)',
        's': 'clamp(0.7502rem, 0.6841rem + 0.2818vw, 0.9377rem)',
        'base': 'clamp(1rem, 0.912rem + 0.3756vw, 1.25rem)',
        'lg': 'clamp(1.333rem, 1.2157rem + 0.5007vw, 1.6663rem)',
        'xl': 'clamp(1.7769rem, 1.6205rem + 0.6674vw, 2.2211rem)',
        '2xl': 'clamp(2.3686rem, 2.1601rem + 0.8896vw, 2.9607rem)',
        '3xl': 'clamp(3.1573rem, 2.8794rem + 1.1859vw, 3.9467rem)',
        '4xl': 'clamp(4.2087rem, 3.8382rem + 1.5807vw, 5.2609rem)',
      },
      // ─── Fluid Spacing ───
      spacing: {
        'xs': 'clamp(0.25rem, 0.206rem + 0.1878vw, 0.375rem)',
        's': 'clamp(0.375rem, 0.309rem + 0.2817vw, 0.5625rem)',
        'm': 'clamp(0.5rem, 0.412rem + 0.3756vw, 0.75rem)',
        'l': 'clamp(0.75rem, 0.618rem + 0.5634vw, 1.125rem)',
        'xl': 'clamp(1rem, 0.8239rem + 0.7512vw, 1.5rem)',
        '2xl': 'clamp(1.5rem, 1.2359rem + 1.1268vw, 2.25rem)',
        '3xl': 'clamp(2rem, 1.6479rem + 1.5023vw, 3rem)',
        '4xl': 'clamp(3rem, 2.4718rem + 2.2535vw, 4.5rem)',
      },
    },
  },
};
