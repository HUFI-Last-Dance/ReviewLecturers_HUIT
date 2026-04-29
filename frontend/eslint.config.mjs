import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

const config = [
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  {
    settings: {
      next: {
        rootDir: "frontend/",
      },
    },
    rules: {
      // Standard Strict Rules
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      
      // Vercel / Next.js Best Practices
      "@next/next/no-img-element": "error",
      "@next/next/no-html-link-for-pages": "off",
      "react/no-unescaped-entities": "error",
      "react/jsx-no-leaked-render": ["error", { "validStrategies": ["ternary"] }],
      
      // Performance
      "react/display-name": "warn"
    }
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"]
  }
];

export default config;
