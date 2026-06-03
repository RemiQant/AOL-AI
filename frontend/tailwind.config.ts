import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'background':                '#121414',
        'surface':                   '#121414',
        'surface-dim':               '#0d0e0f',
        'surface-container-low':     '#1a1c1c',
        'surface-container':         '#1e2020',
        'surface-container-high':    '#292a2a',
        'surface-container-highest': '#343535',
        'surface-bright':            '#38393a',
        'surface-variant':           '#343535',
        'on-surface':                '#e3e2e2',
        'on-surface-variant':        '#bccbb9',
        'primary':                   '#53e076',
        'primary-container':         '#1db954',
        'on-primary':                '#003914',
        'secondary':                 '#d1bcff',
        'secondary-container':       '#5b00cd',
        'on-secondary':              '#3d008f',
        'tertiary':                  '#c8c6c5',
        'outline':                   '#869585',
        'outline-variant':           '#3d4a3d',
        'error':                     '#ffb4ab',
      },
      fontSize: {
        'display-lg':  ['57px', { lineHeight: '64px', letterSpacing: '-0.25px' }],
        'headline-xl': ['32px', { lineHeight: '40px' }],
        'headline-lg': ['28px', { lineHeight: '36px' }],
        'title-lg':    ['22px', { lineHeight: '28px' }],
        'title-md':    ['16px', { lineHeight: '24px', letterSpacing: '0.15px', fontWeight: '500' }],
        'body-lg':     ['16px', { lineHeight: '24px', letterSpacing: '0.5px' }],
        'body-md':     ['14px', { lineHeight: '20px', letterSpacing: '0.25px' }],
        'label-lg':    ['14px', { lineHeight: '20px', letterSpacing: '0.1px', fontWeight: '500' }],
        'label-md':    ['12px', { lineHeight: '16px', letterSpacing: '0.5px', fontWeight: '500' }],
        'label-sm':    ['11px', { lineHeight: '16px', letterSpacing: '0.5px', fontWeight: '500' }],
      },
      spacing: {
        'sm':  '8px',
        'md':  '16px',
        'lg':  '24px',
        'xl':  '40px',
        'xxl': '64px',
        'margin-mobile':  '16px',
        'margin-desktop': '32px',
      },
      borderRadius: {
        'DEFAULT': '8px',
      },
      backdropBlur: {
        'glass': '20px',
      },
      boxShadow: {
        'glow-primary':    '0 0 15px rgba(83,224,118,0.2)',
        'glow-primary-lg': '0 0 20px rgba(83,224,118,0.4)',
        'glow-secondary':  '0 0 15px rgba(209,188,255,0.3)',
        'glow-input':      '0 0 20px rgba(209,188,255,0.2)',
      },
      keyframes: {
        'pulse-slow': {
          '0%':   { transform: 'scale(1)',   opacity: '0.3' },
          '100%': { transform: 'scale(1.1)', opacity: '0.6' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 8s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}

export default config
