import typescript from "@rollup/plugin-typescript";

const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [typescript()],
    external: ["react", "react-dom"],
  },
];

export default config;
