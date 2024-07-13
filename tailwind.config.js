/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontSize: {
                "2xs": "0.666rem",
                "3xs": "0.55rem",
            },
            colors: {
                green: {
                    1000: "#020e06",
                },
            },
            boxShadow: {
                "inner-sm": "inset 0 0 2rem 0.5rem var(--tw-shadow-color)",
                "inner-md": "inset 0 0 4rem 1rem var(--tw-shadow-color)",
            },
            willChange: {
                filter: "filter",
            },
        },
    },
    plugins: [require("@xpd/tailwind-3dtransforms"), require("tailwindcss-breakpoints-inspector")],
};
