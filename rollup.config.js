import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";

export default {
  input: "src/main.js",
  output: {
    file: "background.js",
    format: "cjs"
  },
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**" // only transpile our source code
    }),
    json()
  ]
};
