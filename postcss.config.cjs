module.exports = {
  plugins: {
    autoprefixer: {},
    cssnano: {
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        colormin: true,
        minifyFontValues: true,
        minifySelectors: true,
        mergeLonghand: true,
        mergeRules: true,
        reduceInitial: true,
        reduceTransforms: true,
        uniqueSelectors: true
      }]
    }
  }
};
