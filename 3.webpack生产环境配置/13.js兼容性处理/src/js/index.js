// import "@babel/polyfill";

const add = (x, y)=>{
  return x + y;
}

console.log(add(2, 3));

const promise = new Promise((resolve)=>{
    setTimeout(()=>{
        console.log('定时器结束~');
        resolve();
    },1000)
})


console.log(promise);