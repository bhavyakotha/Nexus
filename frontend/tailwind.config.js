/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "primary-200" : "#8d89e1",
        "primary-100" : "rgb(100, 96, 192)",
        "secondary-200" : "#c8c5eb",
        "secondary-100" : "rgb(146, 141, 208)"
      }
    },
  },
  plugins: [],
}

// --text: #050315;
// --background: #fbfbfe;
// --primary: #8d89e1;
// --secondary:rgb(146, 141, 208);
// --accent:rgb(100, 96, 192);