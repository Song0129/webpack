console.log("index.js文件被加载了");


document.getElementById("btn").onclick = function () {
    // 懒加载 当文件需要使用时才加载
    // 预加载 webpackPrefetch  使用前加载js文件   可以等其他文件加载完成后，等浏览器空闲了，再偷偷加载资源
    // 正常加载  可以认为是并行加载，同一时间加载多个文件
    import(/*webpackChunkName: "test",webpackPrefetch: true*/"./test").then(( {mul} ) => {
        console.log(mul(4, 5));
    });
};