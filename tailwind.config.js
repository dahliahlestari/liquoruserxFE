/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        liquordark: "#1E1E1E",
        liquorgold: "#D0AF5E",
        liquordarkgold: "#88723F",
        liquorgoldlight: "#C39E47",
        // kamu bisa tambahkan sebanyak yang kamu mau
      },
    },
  },
  plugins: [],
};
