const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 单入口===>单页面应用
    // entry: "./src/js/index.js",
    entry: {
        // 多入口 有一个入口，最终输出就有一个bundle ===>多页面应用
        main: "./src/js/index.js",
        test: "./src/js/test.js"
    },
    output: {
        // 取源文件名[name]
        filename: "js/[name].[contenthash:10].js",
        path: resolve(__dirname,'build')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
    ],
    mode: "production"
}