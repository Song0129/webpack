const {resolve} = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/js/index.js",
    output: {
        filename: "built.js",
        path: resolve(__dirname, "build")
    },
    module: {
        rules: [

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
    ],
    // 生成环境下会自动压缩js代码 development
    mode: "development"
};