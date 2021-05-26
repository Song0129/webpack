const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin= require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 定义nodejs环境变量，决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production'

// 服用loader
const commonCssLoader = [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
        // 还需要再package.json中定义browserslist
        loader: "postcss-loader",
        options: {
            ident: 'postcss',
            plugins: ()=>{
                require('postcss-preset-env')()
            }
        }
    }
]

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: "built.js",
        path: resolve(__dirname,'build')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [...commonCssLoader]
            },
            {
                test: /\.less$/,
                use: [...commonCssLoader, 'less-loader']
            },
            /*
                正常来讲，一个文件只能被一个loader处理
                当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
                    先执行eslint 在执行babel
             */
            {
                // 在package.json中eslintConfig--> airbnb
                test: /\.js$/,
                exclude: /node_modules/,
                // 优先执行
                enforce: "pre",
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                useBuiltIns: "usage",
                                corejs: {
                                    version: 3
                                },
                                targets: {
                                    chrome: '60',
                                    firefox: '60',
                                    ie: '9',
                                    safari: '10',
                                    edge: '17'
                                }
                            }
                        ]
                    ]
                }
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8 * 1024,
                    name: '[hash:10].[ext]',
                    outputPath: 'images',
                    esModule: false
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                exclude: /\.(js|css|less|html|jpg|png|gif)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'media'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/built.css'
        }),
        new OptimizeCssAssetsWebpackPlugin()
    ],
    mode: "production"
}