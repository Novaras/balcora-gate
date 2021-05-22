const production = !process.env.ROLLUP_WATCH;

const shotgun = [/^bg-guidestone/];

module.exports = {
  darkMode: 'class', // This can be 'media' if preferred.
  mode: 'jit',
  purge: [
      './src/**/*.svelte',
      './src/**/*.html',
      '/src/app.html'
  ],
  theme: {
    extend: {
      colors: {
        svelte: '#ff3e00',
        'balc-orange': `#ff640a`,
        'balc-blue': `#3386ff`,
        'balc-gray': `#191b1c`,
        'balc-gray-hl': `#3f3f3f`,
        'balc-gray-darker': `#141718`,
        'balc-white': `#f3f4f6`,
        'balc-white-hl': `#d1d5db`,
        'balc-white-brighter': `#ffffff`,
      },
      backgroundImage: {
        karos: `url('images/karos.png')`,
        battle: `url('/images/battle.png')`,
        guidestone: `url('/images/guidestone.png')`,
        swarmerconcept: `url('/images/swarmer-concept.png')`
      },
      minHeight: {
        10: `2.5rem`
      },
      transitionProperty: {
        height: `height`
      },
      zIndex: {
        '-10': `-10`,
      }
    },
  },
  variants: {},
  plugins: [],
}
