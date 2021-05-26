/*
    开发环境配置：能让所有代码运行
        运行项目指令：
            webpack 会将打包结果输出出去
            npx webpack-dev-server 只会在内存中编译打包，没有输出
*/
const {resolve} = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: "js/build.js",
        path: resolve(__dirname,'build')
    },
    module: {
        rules: [
            // loader配置
            {
                // 处理less资源
                test: /\.less$/,
                use: ['style-loader','css-loader','less-loader']
            },
            {
                // 处理css资源
                test: /\.css$/,
                use: ['style-loader','css-loader']
            },
            {
                // 处理图片资源
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8 * 1024,
                    esModule: false,
                    name: '[hash:10].[ext]',
                    outputPath: 'images'
                }
            },
            {
                // 处理html文件的img图片(负责引入img，从而能被url-loader进行处理)
                test: /\.html$/,
                loader: 'html-loader',
                options:{
                    esModule:false,
                }
            },
            // 打包其他资源(除了html/js/css资源以外的资源)
            {
                exclude: /\.(html|js|css|less|jpg|gif|png)/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]',
                    outputPath: 'media'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    mode: "development",
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        compress: true,
        port: 3636,
        open: true,
    }
}