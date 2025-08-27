export default {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
        'not dead',
        'not IE 11'
      ]
    },
    cssnano: {
      preset: [
        'default',
        {
          // Performance-focused optimizations
          discardComments: {
            removeAll: false, // Keep important comments for debugging
          },
          normalizeWhitespace: true,
          minifySelectors: true,
          minifyParams: true,
          minifyFontValues: true,
          colormin: true,
          convertValues: true,
          discardDuplicates: true,
          discardEmpty: true,
          discardOverridden: true,
          discardUnused: false, // Be conservative to avoid breaking styles
          mergeIdents: false, // Avoid breaking CSS custom properties
          mergeLonghand: true,
          mergeRules: true,
          minifyGradients: true,
          normalizeCharset: true,
          normalizeDisplayValues: true,
          normalizePositions: true,
          normalizeRepeatStyle: true,
          normalizeString: true,
          normalizeTimingFunctions: true,
          normalizeUnicode: true,
          normalizeUrl: true,
          orderedValues: true,
          reduceIdents: false, // Preserve CSS custom properties
          reduceInitial: true,
          reduceTransforms: true,
          svgo: true,
          uniqueSelectors: true,
          // Preserve z-index values for proper layering
          zindex: false,
          // Optimize calc() expressions
          calc: true
        },
      ],
    },
  },
};
