import $ from "jquery";

// import {mul} from "./test"
function sum ( ...args ) {
    return args.reduce(( p, c ) => p + c, 0);
}


/*
    通过js代码，让某个文件被单独打包成一个chunk
    import动态导入语法：能将某个文件单独打包
 */

import(/*webpackChunkName: "test"*/"./test")
    .then(( {mul, count} ) => {
        // eslint-disable-next-line
        console.log("文件加载成功", mul(2, 5), count(2, 5));
    })
    .catch(() => {
        // eslint-disable-next-line
        console.log("文件加载 失败");
    });

// eslint-disable-next-line
console.log(sum(1, 2, 3, 4, 5));
// eslint-disable-next-line
console.log($);


console.log(1231231223);