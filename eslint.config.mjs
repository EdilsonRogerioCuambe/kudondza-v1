import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/generated/**",
      "generated/**",
      "**/generated/**",
      "**/*.generated.*",
      "**/*.d.ts",
      "**/prisma/generated/**",
      "**/prisma/client/**",
      "**/prisma/index.*",
      "**/prisma/client.*",
      "**/prisma/edge.*",
      "**/prisma/default.*",
      "**/prisma/wasm.*",
      "**/prisma/index-browser.*",
      "**/*.node",
      "**/query_engine-*",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default eslintConfig;
