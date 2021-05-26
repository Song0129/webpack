const {resolve} = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    stats: {
        // 添加资源信息
        assets: true,
        // 添加构建日期和构建时间信息
        builtAt: true,
        chunks: true,
        chunkModules: true,
        // 添加 compilation 的哈希值
        hash: true,
        // 添加 webpack 版本信息
        version: true,
        source: true,
    },
    entry: "./src/index.js",
    output: {
        filename: "built.js",
        path: resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            },
            // 打包其他资源(除了html/js/css资源以外的资源)
            {
                exclude: /\.(html|js|css)/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    mode: "development"
};