const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

module.exports = {
    entry: "./src/js/index.js",
    output: {
        filename: "js/built.js",
        path: resolve(__dirname,'build')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        // 告诉webpack那些库不参与打包，同时使用时的名称也得边~
        new webpack.DllReferencePlugin({
            manifest: resolve(__dirname,'dll/manifest.json')
        }),
        // 将某个文件打包输出出去，并在html中自动引入该资源
        new AddAssetHtmlWebpackPlugin({
            filepath: resolve(__dirname,'dll/jquery.js')
        })
    ],
    mode: "production",
};
