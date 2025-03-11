/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),

  ],
  theme: {
    extend: {
      screens: {
        'small': '300px',  
        'xsmall': '340px',  
        'xssmall': '390px',  

        'ssm': '460px',  
        'sssm': '500px',  

        'ssssm': '580px',  

        'md': '768px',  
        'lg': '1400px', 
      },
    },
  },
  plugins: [
    flowbite.plugin(),
    require('@tailwindcss/line-clamp'),

  ],
};
