/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      fontFamily: {
        gil: ["Montserrat"],
      },
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/forms"),
  ],
};
