import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// eslint-config-next ships flat config directly from v16, so there is no
// FlatCompat wrapper here. The core-web-vitals entry already includes
// next/typescript.
const config = [
  {
    ignores: [".next/**", "coverage/**", "next-env.d.ts", "public/**"],
  },
  ...nextCoreWebVitals,
];

export default config;
