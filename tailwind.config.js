/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            animation: {
                "from-out-to-x-0": "500ms linear 0s 1 normal both running frLe",
                "to-out-from-x-0": "500ms linear 0s 1 normal both running toLe",
            },
            keyframes: {
                frLe: {
                    "0%": {
                        transform: "translateZ(-8rem)",
                    },
                    "20%": {
                        transform: "translateZ(-8rem)",
                    },
                    "100%": {
                        transform: "translateZ(4rem)",
                    },
                },
                toLe: {
                    "0%": {
                        transform: "translateX(0)",
                    },
                    "66.666%": {},
                },
            },
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
