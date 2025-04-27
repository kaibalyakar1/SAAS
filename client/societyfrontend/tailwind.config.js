module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        logoZoom: "logoZoom 1.8s ease-in-out infinite",
        wave: "wave 0.5s ease-in-out forwards",
      },
      keyframes: {
        logoZoom: {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "50%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(0.9)", opacity: "0.8" },
        },
        wave: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
