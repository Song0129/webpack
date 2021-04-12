/*
    webpack.config.js  webpack配置文件
        作用：指示webpack干哪些活==》运行webpack指令时，会加载当前配置

    所有构建工具都是基于node.js运行  模块化默认使用commonJS
*/

// resolve 用来拼接绝对路径的方法
const { resolve } = require("path");

module.exports = {
    // webpack配置
    // 入口文件
    entry: "./src/index.js",
    // 输出
    output: {
        // 输出文件名
        filename: "built.js",
        // 输出路径
        // __dirname nodejs的变量，代表当前文件的目录绝对路径
        path: resolve(__dirname,'build'),
    },
    // loader的配置
    module: {
        rules: [
            // 详细loader的配置
            // 不同文件必须配置不同loader处理
            {
                // 匹配那些文件
                test: /\.css$/,
                // 使用那些loader进行处理
                use: [
                    // use数组中loader执行顺序：从右向左，从下到上一次执行
                    // 创建style标签，将js中的样式资源插入进行，添加到head中生效
                    'style-loader',
                    // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    // 将less文件编译成css文件
                    'less-loader',
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    // 将scss文件编译成css文件 
                    'sass-loader'
                ]
            }
        ]
    },
    // plugins的配置
    plugins: [
        // 详细plugins的配置
    ],
    // 模式
    mode: 'development',
    // mode: 'production',
};
