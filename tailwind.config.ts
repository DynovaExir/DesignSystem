import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-yekan-bakh)", "system-ui", "sans-serif"],
      },
      colors: {
        // Collection 2 — Semantic Colors
        "color-bg": {
          DEFAULT: "var(--color-bg-default)",
          default: "var(--color-bg-default)",
          subtle: "var(--color-bg-subtle)",
          muted: "var(--color-bg-muted)",
          elevated: "var(--color-bg-elevated)",
          overlay: "var(--color-bg-overlay)",
        },
        "color-text": {
          DEFAULT: "var(--color-text-default)",
          default: "var(--color-text-default)",
          subtle: "var(--color-text-subtle)",
          disabled: "var(--color-text-disabled)",
          inverse: "var(--color-text-inverse)",
          link: "var(--color-text-link)",
        },
        "color-interactive": {
          DEFAULT: "var(--color-interactive-default)",
          default: "var(--color-interactive-default)",
          hover: "var(--color-interactive-hover)",
          active: "var(--color-interactive-active)",
          subtle: "var(--color-interactive-subtle)",
          focus: "var(--color-interactive-focus)",
        },
        "color-border": {
          DEFAULT: "var(--color-border-default)",
          default: "var(--color-border-default)",
          strong: "var(--color-border-strong)",
          focus: "var(--color-border-focus)",
        },
        "color-icon": {
          DEFAULT: "var(--color-icon-default)",
          default: "var(--color-icon-default)",
          subtle: "var(--color-icon-subtle)",
          interactive: "var(--color-icon-interactive)",
          disabled: "var(--color-icon-disabled)",
        },
        "color-status": {
          success: "var(--color-status-success)",
          "success-bg": "var(--color-status-success-bg)",
          danger: "var(--color-status-danger)",
          "danger-bg": "var(--color-status-danger-bg)",
          info: "var(--color-status-info)",
          "info-bg": "var(--color-status-info-bg)",
          warning: "var(--color-status-warning)",
          "warning-bg": "var(--color-status-warning-bg)",
        },
        "color-selection": {
          selected: "var(--color-selection-selected)",
          highlighted: "var(--color-selection-highlighted)",
        },
      },
      spacing: {
        "space-0": "0px",
        "space-1": "4px",
        "space-2": "8px",
        "space-3": "12px",
        "space-4": "16px",
        "space-5": "24px",
        "space-6": "32px",
        "space-7": "48px",
        "space-8": "64px",
        "space-9": "96px",
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
        xs: "0 1px 2px rgba(0,0,0,0.06)",
        sm: "0 2px 8px rgba(0,0,0,0.08)",
        md: "0 4px 16px rgba(0,0,0,0.10)",
        lg: "0 8px 32px rgba(0,0,0,0.12)",
      },
      fontSize: {
        "display-lg": ["32px", { lineHeight: "1.25", fontWeight: "600" }],
        "display-md": ["28px", { lineHeight: "1.25", fontWeight: "600" }],
        "display-sm": ["24px", { lineHeight: "1.25", fontWeight: "600" }],
        "heading-lg": ["20px", { lineHeight: "1.25", fontWeight: "600" }],
        "heading-sm": ["18px", { lineHeight: "1.25", fontWeight: "600" }],
        "body-lg-semibold": ["16px", { lineHeight: "1.5", fontWeight: "600" }],
        "body-lg-regular": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm-semibold": ["14px", { lineHeight: "1.5", fontWeight: "600" }],
        "body-sm-regular": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-lg-semibold": ["12px", { lineHeight: "1.5", fontWeight: "600" }],
        "label-lg-regular": ["12px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-sm-semibold": ["10px", { lineHeight: "1.5", fontWeight: "600" }],
      },
      opacity: {
        hover: "0.08",
        pressed: "0.16",
        disabled: "0.4",
        "scrim-subtle": "0.3",
        skeleton: "0.6",
        scrim: "0.5",
      },
    },
  },
  plugins: [],
}

export default config
