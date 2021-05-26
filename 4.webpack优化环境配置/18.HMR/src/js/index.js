// 引入iconfont样式文件
import "../css/iconfont.css";
import "../css/index.less";
import printCode from './printCode'

console.log('index.js被加载了');

printCode();

function add ( x, y ) {
    return x + y;
}


console.log(add(1, 2));
console.log(module.hot)

if (module.hot) {
    // 一旦module.hot为true，说明开启了HMR功能。-->让HMR功能代码生效
    module.hot.accept('./printCode.js',function () {
        // 方法会监听print.js文件的变化，一旦发生变化，其他默认不会重新打包构建
        // 会执行后面的后调函数
        printCode();
    })
}