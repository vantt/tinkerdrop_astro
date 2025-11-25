/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "max-width": "none",
            color: theme("colors.gray.700"),
            lineHeight: "1.75",
            letterSpacing: "0.01em",
            h1: {
              color: theme("colors.gray.900"),
              fontWeight: "800",
              letterSpacing: "-0.025em",
              scrollMarginTop: "5rem",
            },
            h2: {
              color: theme("colors.gray.900"),
              fontWeight: "700",
              letterSpacing: "-0.025em",
              marginTop: "3em",
              marginBottom: "1.5em",
              scrollMarginTop: "5rem",
            },
            h3: {
              color: theme("colors.gray.900"),
              fontWeight: "600",
              marginTop: "2em",
              marginBottom: "1em",
              scrollMarginTop: "5rem",
            },
            blockquote: {
              borderLeftWidth: "4px",
              borderLeftColor: theme("colors.gray.200"),
              fontStyle: "italic",
              backgroundColor: theme("colors.gray.50"),
              padding: "1rem",
              borderRadius: "0.25rem",
              fontWeight: "500",
              color: theme("colors.gray.700"),
              quotes: "none",
            },
            code: {
              color: theme("colors.pink.600"),
              backgroundColor: theme("colors.gray.100"),
              paddingLeft: "0.25rem",
              paddingRight: "0.25rem",
              paddingTop: "0.125rem",
              paddingBottom: "0.125rem",
              borderRadius: "0.25rem",
              fontWeight: "500",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            "pre code": {
              color: "inherit",
              backgroundColor: "transparent",
              padding: "0",
            },
            img: {
              borderRadius: theme("borderRadius.xl"),
              boxShadow: theme("boxShadow.lg"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
