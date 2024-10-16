import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#A4FFEE',
          DEFAULT: '#32E4D0',
          dark: '#00CDB6',
          container: '#352777',
        },
        secondary: {
          light: '#E6A3FF',
          DEFAULT: '#CB78EA',
          dark: '#B355D5',
          container: '#8BF4E1',
        },
        yellow: {
          light: '#FFF9E0',
          DEFAULT: '#FFF0B6',
          dark: '#F9E07D',
          container: '#352777',
        },
        error: {
          DEFAULT: '#E83A34',
        },
        text: {
          DEFAULT: '#F0F0F0',
          gray: '#A0A0A0',
        },
        gray: {
          100: '#F2F2F7',
          200: '#E5E5EA',
          300: '#C7C7CC',
          500: '#AEAEB2',
          700: '#808080',
          900: '#404040',
        },
      },
      backgroundImage: {
        'gradient-purple':
          'linear-gradient(#350D6D 0%, #352778 20%, #5D4DA6 85%)',
        'gradient-primary': 'linear-gradient(120deg, #32E4D0 0%, #CB78EA 80%)',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '976px',
        xl: '1024px',
        '2xl': '1440px',
      },
      fontFamily: {
        sans: ['Pretendard', 'Noto Sans CJK KR', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        sm: '0.875rem',
        DEFAULT: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
      },
      width: {
        sm: '3.75rem', // 60px
        md: '6.25rem', // 100px
        lg: '12.5rem', // 200px
        xl: '18.75rem', // 300px
        '2xl': '31.25rem', // 500px
        '3xl': '62.5rem', // 1000px
        'icon-sm': '1rem',
        'icon-md': '1.5rem',
        'icon-lg': '2.25rem',
      },
      height: {
        sm: '2rem',
        md: '3rem',
        lg: '3.75rem', // 60px
        xl: '6.25rem', // 200px
        '2xl': '15.625rem', // 250px
        'icon-sm': '1rem',
        'icon-md': '1.5rem',
        'icon-lg': '2.25rem',
      },
      spacing: {
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '4rem',
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        DEFAULT: '0 4px 4px rgba(0, 0, 0, 0.25)',
        light: '0 4px 4px rgba(0, 0, 0, 0.10)',
      },
      opacity: {
        low: '.25',
        DEFAULT: '.5',
        high: '.75',
      },
      zIndex: {
        DEFAULT: '0',
        10: '10',
        20: '20',
        30: '30',
        40: '40',
        50: '50',
      },
    },
  },
  plugins: [],
}
export default config
