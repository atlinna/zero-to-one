# plugin 插件

loader 的定位功能是转换代码

plugin 的本质是一个带有 apply 方法的对象

```
var plugin = {
    apply:function (compiler){

    }
}
```

apply 方法会在 compiler 对象 创建好后自动调用，并向 apply 函数传递一个 compiler 对象

初始化 --》 compiler 对象创建 --》compilation
--》 （编译）--》 输出
如果代码发生改变 不会重新初始化 而是通过 compiler 创建一个新的 compilation 然后输出新的代码

### compiler 和 compilation 有什么区别

区别：在代码发生改变的时候 compiler 不会重新创建 而 compiler 会重新创建一个新的 compilation

### webpack.config.js 中的引入方式

```
  module.exports ={
      plugin:[
          new MyPlugin()
      ]
  }
```

### webpack 环境区分

webpack 支持 导出一个函数作为配置 函数中必须 return 一个 webpack 的配置对象

```
 module.exports= env =>{
     return { mode:'production'}
 }
```

如果直接取 env 是没有值得 undefined 因为 env 是接收的命令行参数 可以使用以下命令

- npx webpack --env abc                              --> env = abc abc= true
- npx webpack --env.abc = 1                          --> env={abc:1}
- npx webpack --env.abc=1 --env.bcd = 2              --> env={abc:1,bcd:2}
