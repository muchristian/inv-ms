/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      mont: ["Montserrat"],
    },

    colors: {
      primary: "#FFF",
      secondary: "#8A87DE",
      background: "#f4f5fa",
      text: "#000000",
      success: "#14b8a6",
      warning: "#eab308",
      danger: "#ef4444",
    },
    boxShadow: {
      normalRight: "0px 16px 15px 0px rgba(0,0,0,0.07)",
    },
    extend: {
      minHeight: {
        "3/5": "600px",
      },
    },
  },
  plugins: [],
};
