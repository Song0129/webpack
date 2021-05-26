/*
    开发环境配置：能让所有代码运行
        运行项目指令：
            webpack 会将打包结果输出出去
            npx webpack-dev-server 只会在内存中编译打包，没有输出

    HMR: hot module replacement 热模块替换/模块热替换
        作用：一个模块发生变化，只会重新打包这一个模块（而不是打包所有模块）
            极大提升构建速度
    样式文件：可以使用HMR功能，因为style-loader中实现了
    js文件：默认不能使用HMR功能 --> 需要修改js代码，添加支持HMR功能的代码
        注意；HMR功能对js的处理，只能处理非入口js文件的其他文件。
    html文件：默认不能使用HMR功能，同时会导致问题：html文件不能热更新
        解决：修改entry入口，将html文件引入
*/
const {resolve} = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
    entry: ['./src/js/index.js','./src/index.html'],
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
        // 开启HMR功能
        // 修改webpack 配置，新配置要生效需要重启webpack服务
        hot: true,
    },
    devtool: 'eval-source-map'
}

/*
    source-map:一种提供源代码到构建后代码映射技术（如果构建代码出错了，通过映射可以追踪源代码错误）
        [inline-|hidden-|eval-][nosource-][cheap-[module-]]source-map

        source-map: 外部
            错误代码的位置 和 源代码的错误位置
        inline-source-map: 内联
            只生成一个内联source-map
            错误代码的位置 和 源代码的错误位置
        hidden-source-map: 外部   隐藏源代码
            错误代码错误原因，但是没有错误位置
            不能追踪源代码错误，只能提示到构建后代码的错误位置
        eval-source-map:内联
            每一个文件都生成对应的source-map,都在eval
            错误代码的位置 和 源代码的错误位置
        nosource-source-map: 外部   隐藏源代码
            错误代码准确信息，但是没有任何源代码信息
        cheap-source-map: 外部
            错误代码准确信息 和 源代码的错误位置
            只能精确到行
        cheap-module-source-map: 外部
            错误代码准确信息 和 源代码的错误位置

        内联和外部的区别：1.外部生成了文件，内联没有 2.内联构建速度更快

        开发环境：速度快，调试更友好
            速度快（eval>inline>cheap>...）
                eval-cheap-source-map
                eval-source-map
            调试更友好
                source-map
                cheap-module-source-map
                cheap-source-map
            -->eval-source-map   /  eval-cheap-module-source-map
        生产环境：源代码要不要隐藏？调试要不要友好？
            内联会让代码提示变大，所以在生产环境不用内联
            nosource-source-map  全部隐藏
            hidden-source-map  只隐藏源代码，会提示构建后代码错误信息

            source-map

            -->source-map / cheap-module-source-map
 */