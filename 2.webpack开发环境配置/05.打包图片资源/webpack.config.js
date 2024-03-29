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
    },
    entry: "./src/index.js",
    output: {
        filename: "built.js",
        path: resolve(__dirname, "build"),
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            },
            {
                // 问题：处理不了html中的img图片
                // 处理图片资源
                test: /\.(jpg|png|gif)$/,
                // 使用一个loader
                // 下载url-loader file-loader
                loader: 'url-loader',
                options: {
                    // 图片大小大于8kb，就会被base64处理
                    // 优点：减少请求数量（减轻服务器压力）
                    // 缺点：图片体积会增大（文件请求速度更慢）
                    limit: 8 * 1024,
                    // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
                    // 解析时会出问题: [object module]
                    // 解决：关闭url-loader的es6模块化，使用commonjs解析
                    esModule: false,
                    // 给图片进行重命名
                    // [hash:10]取图片hash值的前10位
                    // [ext]取文件原来扩展名
                    name: '[hash:10].[ext]'
                }
            },
            {
                test: /\.html$/,
                // 处理html文件的img图片(负责引入img，从而能被url-loader进行处理)
                loader: 'html-loader',
                options:{
                    esModule:false,
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