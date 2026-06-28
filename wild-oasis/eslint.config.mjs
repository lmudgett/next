import next from "eslint-config-next";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...next,
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
