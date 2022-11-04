const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    '../layouts/**/*.html',
    '../assets/**/*.js',
    './content/**/*.md',
    './hugo_stats.json',
  ],
  theme: {
    screens: {
      xl: {'max': '1280px'},
      lg: {'max': '992px'},
      md: {'max': '768px'},
      sm: {'max': '480px'},
    },
    minHeight: {
      'screen-1/2': '50vh',
      'screen-2/3': '66vh',
      'screen-3/4': '75vh',
    },
    extend: {
      spacing: {
        '128': '32rem',
        '160': '40rem',
        '192': '48rem',
        '200': '50rem',
        '256': '64rem',
      }
    },
    fontFamily: {
      sans: [ '"Noto Sans KR"', ...fontFamily.sans],
    },
  }
};

