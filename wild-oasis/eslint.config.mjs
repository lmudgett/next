import next from "eslint-config-next";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...next,
  {
    rules: {
      "@next/next/no-img-element": "off",
      // react-hook-form's watch() is flagged by the React Compiler lint as an
      // "incompatible library"; RHF is a deliberate choice, so silence it.
      "react-hooks/incompatible-library": "off",
    },
  },
];

export default eslintConfig;
