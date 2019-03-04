import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import rollupTypescript from "rollup-plugin-typescript";

// 扩展名
const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
    input: "./src/index.ts",
    output: [
        {
            file: "lib/index.js",
            format: "umd",
            name: "Utils",
            sourcemap: true
        },
        {
            file: "es/index.js",
            format: "es",
            sourcemap: true
        }
    ],
    plugins: [
        resolve({
            jsnext: true,
            extensions
        }),
        commonjs({
            include: "node_modules/**"
        }),
        rollupTypescript()
    ]
};
