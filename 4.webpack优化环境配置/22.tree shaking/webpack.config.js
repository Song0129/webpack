const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin= require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

/*
    tree-shaking：去除无用代码
        前提：1.必须使用ES6模块化  2.开启production环境
        作用：减少代码体积

        在package.json中配置
            "sideEffects": false 所有代码都没有副作用（都可以进行tree shaking）
            问题：可能会把css/ @babel/polyfill （副作用）文件干掉
            "sideEffects": ["*.css","*.less"]   保证css文件不会被tree-shaking
 */

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
        filename: "js/built.[contenthash:10].js",
        path: resolve(__dirname,'build')
    },
    module: {
        rules: [
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
                // 以下loader只会匹配一个
                // 注意：不能有两个配置(loader)处理同一个文件
                oneOf: [
                    {
                        test: /\.css$/,
                        use: [...commonCssLoader]
                    },
                    {
                        test: /\.less$/,
                        use: [...commonCssLoader, 'less-loader']
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
                            ],
                            // 开启babel缓存
                            // 第二次构建时，会读取之前的缓存
                            cacheDirectory: true,
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
            filename: 'css/built.[contenthash:10].css'
        }),
        new OptimizeCssAssetsWebpackPlugin()
    ],
    mode: "production",
    devtool: "source-map"
}