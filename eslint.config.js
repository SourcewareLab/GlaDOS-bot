// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from "globals";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  prettier,
  {
    ignores: ["dist/"],
    files: ["**/*.ts", "**/*.js"],
    linterOptions: {
      reportUnusedDisableDirectives: true,
      noInlineConfig: true
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["src/commands/*/subcommands/*.js"],
              message: "Please import from the respective subcommands.ts"
            }
          ]
        }
      ]
    }
  }
);