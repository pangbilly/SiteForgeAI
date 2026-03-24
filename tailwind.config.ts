import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1F4E79',
        'navy-dark': '#1a3f5f',
        'navy-light': '#2d5fa3',
        blue: '#2E75B6',
        'blue-dark': '#1f4e7a',
        'blue-light': '#5b93d1',
      },
      backgroundColor: {
        'construction': '#f5f5f5',
      },
      borderColor: {
        'construction': '#e0e0e0',
      },
    },
  },
  plugins: [],
}

export default config
