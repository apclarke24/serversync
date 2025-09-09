import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default [
  // ES Module build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: [
      typescript({
        typescript: require("typescript"),
        clean: true,
      }),
    ],
    external: ["react", "use-sync-external-store"],
  },
  // CommonJS build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
    plugins: [
      typescript({
        typescript: require("typescript"),
        clean: false,
      }),
    ],
    external: ["react", "use-sync-external-store"],
  },
  // Minified build for CDN
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.min.js",
      format: "umd",
      name: "ServerSync",
      sourcemap: true,
      globals: {
        react: "React",
        "use-sync-external-store": "useSyncExternalStore",
      },
    },
    plugins: [
      typescript({
        typescript: require("typescript"),
        clean: false,
      }),
      terser(),
    ],
    external: ["react", "use-sync-external-store"],
  },
];
