/** @type {import('eslint').Linter.Config[]} */
export default {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    root: true,
}