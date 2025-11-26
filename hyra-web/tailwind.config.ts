import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  safelist: [
    // ===== Typography =====
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl',
    'text-2xl', 'text-3xl', 'text-4xl',
    'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold',
    'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed',

    // ===== Color =====
    'text-gray-700', 'text-gray-800', 'text-gray-900',
    'text-gray-500', 'text-gray-600',
    'text-red-500', 'text-blue-500', 'text-green-500',
    'bg-white', 'bg-gray-100', 'bg-gray-200', 'bg-gray-50',
    'bg-blue-50', 'bg-red-50', 'bg-yellow-50',

    // ===== Spacing =====
    'p-2', 'p-4', 'p-6',
    'm-2', 'm-4', 'm-6',
    'my-2', 'my-4', 'my-6',
    'mx-2', 'mx-4', 'mx-6',
    'py-2', 'py-4', 'py-6',
    'px-2', 'px-4', 'px-6',

    // ===== Border & Radius =====
    'border', 'border-2', 'border-gray-200', 'border-gray-300',
    'rounded', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl',

    // ===== Shadow =====
    'shadow', 'shadow-sm', 'shadow-md', 'shadow-lg',

    // ===== Layout =====
    'flex', 'flex-col', 'flex-row', 'items-center', 'justify-center', 'justify-between',
    'gap-2', 'gap-4', 'gap-6',

    'grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3',
    'w-full', 'max-w-md', 'max-w-lg', 'max-w-xl',

    // ===== Lists =====
    'list-disc', 'list-decimal', 'list-inside',
    'space-y-2', 'space-y-4',

    // ===== Text alignment =====
    'text-left', 'text-center', 'text-right',

    // ===== Pattern (bảo hiểm cho mọi class AI tạo) =====
    { pattern: /^(bg|text|p|m|my|mx|py|px|border|rounded|leading|font|shadow|flex|grid|gap|list|space|w|max-w|items|justify|text)-(.*)$/ }
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
} satisfies Config;
