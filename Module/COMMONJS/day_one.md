# Common JS

## CommonJS 通过 exports 导出模块，require 引入模块

## 可以把 exports 当做空对象 这样 exports.abc = '123' 可以导出一个{abc:'123'}的对象

- 如果一个 js 中存在 exports 和 require 那么该 JS 文件一个模块
- 模块内所有代码均为隐藏代码，包括全局变量、全局函数，这些全局的内容均不应该对全局变量造成污染
- 如果一个模块需要暴露一些 API 给外部使用，需要通过 exports 导出，exports 可以当做一个空对象，你可以为这个空对象添加任何想要导出的内容
- 如果一个模块需要导入其他模块的内容，通过 require 实现，require 是一个函数，传入模块的路径就能返回模块导出的内容

## Node 对 CommonJS 的实现

- 为保证高效的执行，只加载必要的模块。nodeJS 只有执行到有 require 函数的时候才会运行并加载模块
- 为了隐藏模块中的代码，nodeJS 执行模块的时候，会将模块中的所有代码放到一个函数中去执行，来保证不污染全局变量

```
 相当于一个匿名函数
 (function (){
     <!-- 模块中的所有代码 -->
 })()
```

- 为了保证顺利的导出模块，nodeJS 做了一下处理
  - 在模块开始前初始化 module.exports = {}
  - module.exports 即为模块导出的值
  - 为了方便开发者快速导出，又声明了一个变量 exports 然后让 exports = module.exports
  ```
   (function (module){
       module.exports = {}
       let exports = module.exports
       <!-- 模块内所有代码 -->
       return module.exports
   })()
  ```
  - 为了避免重复多次的加载同一个模块，nodeJS默认开启了模块缓存，如果加载的模块已经加载过了，则会自动导出之前的导出结果
    - 加载模块--》是否存在缓存 --》存在则导出之前缓存的结果
                           --》不存在则会运行模块 同时 会缓存模块导出的结果
