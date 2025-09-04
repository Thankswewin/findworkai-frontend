// Add this to your tailwind.config.js plugins array
module.exports = {
  theme: {
    extend: {
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      rotate: {
        'y-12': 'rotateY(12deg)',
        'x-6': 'rotateX(-6deg)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.perspective-2000': {
          perspective: '2000px',
        },
        '.transform-style-preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.rotate-y-12': {
          transform: 'rotateY(12deg)',
        },
        '.rotate-x-6': {
          transform: 'rotateX(-6deg)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
