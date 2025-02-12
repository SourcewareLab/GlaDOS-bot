// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import drizzle from "eslint-plugin-drizzle";
import globals from "globals";

export default tseslint.config(
    {
        ignores: ["dist/"],
        files: ["**/*.ts", "**/*.js",],
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node
            }
        }
    },
    eslint.configs.recommended,
    tseslint.configs.recommended,
    drizzle,
    prettier,
);