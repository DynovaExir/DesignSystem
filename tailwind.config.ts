import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-yekan)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
      },
      colors: {
        // Primitives
        primary: {
          100: "oklch(0.9392 0.0218 230.5480)",
          300: "oklch(0.7224 0.0882 233.2618)",
          500: "oklch(0.4528 0.0932 239.3717)",
          700: "oklch(0.3334 0.0687 240.8240)",
          900: "oklch(0.2247 0.0418 239.4563)",
          DEFAULT: "oklch(0.4528 0.0932 239.3717)",
        },
        neutral: {
          100: "oklch(0.9670 0.0029 264.5419)",
          300: "oklch(0.8717 0.0093 258.3382)",
          500: "oklch(0.5510 0.0234 264.3637)",
          700: "oklch(0.3729 0.0306 259.7328)",
          900: "oklch(0.2101 0.0318 264.6645)",
        },
        success: {
          100: "oklch(0.9500 0.0400 148.5503)",
          500: "oklch(0.4987 0.1370 148.5503)",
          DEFAULT: "oklch(0.4987 0.1370 148.5503)",
        },
        danger: {
          100: "oklch(0.9500 0.0400 14.8226)",
          500: "oklch(0.5338 0.1963 14.8226)",
          DEFAULT: "oklch(0.5338 0.1963 14.8226)",
        },
        warning: {
          100: "oklch(0.9682 0.0254 78.9209)",
          500: "oklch(0.6204 0.1256 72.1985)",
          DEFAULT: "oklch(0.6204 0.1256 72.1985)",
        },
        info: {
          100: "oklch(0.9500 0.0400 289.6787)",
          500: "oklch(0.4491 0.2306 289.6787)",
          DEFAULT: "oklch(0.4491 0.2306 289.6787)",
        },
        // Semantic
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        md: "12px",
        lg: "20px",
        xl: "32px",
        full: "999px",
      },
      boxShadow: {
        none: "none",
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        sm: "0 2px 8px 0 rgba(0, 0, 0, 0.08)",
        md: "0 4px 16px 0 rgba(0, 0, 0, 0.10)",
        lg: "0 8px 32px 0 rgba(0, 0, 0, 0.12)",
      },
      spacing: {
        0: "0px",
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "24px",
        6: "32px",
        7: "48px",
        8: "64px",
        9: "96px",
      },
      fontSize: {
        // Display
        "display-lg": ["32px", { lineHeight: "1.25", fontWeight: "600" }],
        "display-md": ["28px", { lineHeight: "1.25", fontWeight: "600" }],
        "display-sm": ["24px", { lineHeight: "1.25", fontWeight: "600" }],
        // Heading
        "heading-lg": ["20px", { lineHeight: "1.25", fontWeight: "600" }],
        "heading-sm": ["18px", { lineHeight: "1.25", fontWeight: "600" }],
        // Body
        "body-lg-semibold": ["16px", { lineHeight: "1.5", fontWeight: "600" }],
        "body-lg-regular": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm-semibold": ["14px", { lineHeight: "1.5", fontWeight: "600" }],
        "body-sm-regular": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        // Label
        "label-lg-semibold": ["12px", { lineHeight: "1.5", fontWeight: "600" }],
        "label-lg-regular": ["12px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-sm-semibold": ["10px", { lineHeight: "1.5", fontWeight: "600" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
