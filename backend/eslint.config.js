import js from "@eslint/js";
import globals from "globals";
import jest from "eslint-plugin-jest";

export default [
  js.configs.recommended,

  // Code Node (API)
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.node
    },
    rules: {
      "no-console": "off"
    }
  },

  // Tests Jest
  {
    files: ["tests/**/*.js"],
    plugins: {
      jest
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...jest.environments.globals.globals
      }
    },
    rules: {
      ...jest.configs.recommended.rules
    }
  }
];
