const js = require("@eslint/js");
const globals = require("globals");
const nodePlugin = require("eslint-plugin-n");
const google = require("eslint-config-google");

module.exports = [
  {
    ignores: ["dist", "node_modules"],
  },
  {
    files: ["**/*.{js,cjs,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.node,
        Event: "off",
      },
    },
    plugins: {
      js,
      n: nodePlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...google.rules,
      "valid-jsdoc": "off",
      "require-jsdoc": "off",
      "new-cap": "off",
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "no-trailing-spaces": "error",
      "space-before-blocks": ["error", "always"],
      "keyword-spacing": ["error", { before: true, after: true }],
      "max-len": ["error", { code: 120 }],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "const", next: "*" },
        { blankLine: "any", prev: "const", next: "const" },
      ],
      "n/no-missing-require": "error",
      "space-infix-ops": ["error"],
      "linebreak-style": "off",
    },
  },
];