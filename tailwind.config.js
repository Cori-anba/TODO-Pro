/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: 'var(--surface)',
        card: 'var(--card)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        border: 'var(--border)',
        'border-hover': 'var(--border-hover)',
        'input-bg': 'var(--input-bg)',
        'input-bg-focus': 'var(--input-bg-focus)',
        accent: 'var(--accent)',
        'hover-bg': 'var(--hover-bg)',
        'tag-high-bg': 'var(--tag-high-bg)',
        'tag-high-text': 'var(--tag-high-text)',
        'tag-mid-bg': 'var(--tag-mid-bg)',
        'tag-mid-text': 'var(--tag-mid-text)',
        'tag-low-bg': 'var(--tag-low-bg)',
        'tag-low-text': 'var(--tag-low-text)',
        'overdue-border': 'var(--overdue-border)',
        'overdue-bg': 'var(--overdue-bg)',
        'empty-icon-bg': 'var(--empty-icon-bg)',
        'empty-icon-color': 'var(--empty-icon-color)',
        'scrollbar-thumb': 'var(--scrollbar-thumb)',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'btn': '8px',
        'card': '12px',
        'tag': '20px',
        'modal': '16px',
      },
      boxShadow: {
        'card': '0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 2px 8px rgba(0,0,0,0.06)',
        'modal': '0 8px 30px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
