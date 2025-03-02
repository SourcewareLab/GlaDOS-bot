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
    // TODO: find a way to restrict commands from import specific subcommands, instead of them import the subcommands.ts file
    // rules: {
    //   "no-restricted-imports": [
    //     "error",
    //     {
    //       "patterns": [
    //         {
    //           "group": ["src/commands/**/subcommands/*.ts"],
    //           "message": "Please import from the respective subcommands.ts"
    //         }
    //       ]
    //     }
    //   ]
    // }
  }
);