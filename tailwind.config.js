/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // نظام ألوان "رقي" — كحلي/أسود فاخر + ذهبي معدني
        ink: {
          950: '#07090c',
          900: '#0c0f14',
          800: '#12161d',
          700: '#1b212b',
          600: '#262e3b'
        },
        gold: {
          200: '#f2e2b8',
          300: '#e8ce93',
          400: '#dcc27a',
          500: '#c9a24b',
          600: '#a9812f'
        },
        bone: '#f4efe4'
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        arabicDisplay: ['"Aref Ruqaa"', 'serif'],
        body: ['"Tajawal"', 'sans-serif']
      },
      letterSpacing: {
        widest2: '0.35em'
      },
      backgroundImage: {
        'gold-line': 'linear-gradient(90deg, transparent, #c9a24b, transparent)',
        'radial-fade': 'radial-gradient(circle at 50% 0%, rgba(201,162,75,0.12), transparent 60%)'
      }
    }
  },
  plugins: []
}
