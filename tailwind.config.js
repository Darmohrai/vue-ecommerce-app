/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Вказуємо, де Tailwind шукатиме класи
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}