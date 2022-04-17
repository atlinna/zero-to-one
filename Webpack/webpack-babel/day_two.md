# 性能优化

webpack 性能优化主要从三方面入手

- 构建性能
- 传输性能
- 运行性能

## 构建性能

构建性能主要是在开发阶段
优化的目标是降低从打包开始，到代码呈现所经过的时间
构建性能会影响开发效率

## 传输性能

传输性能是指我们打包后的 js 传输到用户浏览器的时间
在优化传输性能的时候要考虑到：
1、总传输量：所有需要传输的 js 文件的总和，重复代码越少总传输量越少
2、文件数量：当访问文件时，需要传输的 js 文件的数量，文件数量越多，http 请求越多，响应速度越慢。
3、浏览器缓存：JS 文件会被浏览器缓存，被缓存的 js 文件不会再进行传输。

## 运行性能

JS 代码在浏览器运行的速度。
**永远不要过早的关注性能，因为你无法完全预知最终的性能**

## 传输性能优化方式

1、减少模块解析
什么是模块解析？
**模块解析包括：AST 抽象语法树分析、依赖分析、模块语法替换**
如何让模块不解析（webpack.config.js）

```
module.exports ={
    module:{
        noParse:/test/ //匹配这个正则表达式的则会不解析该模块
    }
}
```

2、限制 loader 作用范围
原因：babel 是为了将代码转换为 ES5 的代码 为浏览器兼容性做的，但是原本的一些 js 库本身就是 ES5 不存在转换 这样就耗费了性能。
方法
如何让 loader 不转换目标代码（webpack.config.js）

```
module.exports={
    rules:[
        {
            test:/\.js$/,
            include:/\.\/src/,
            use:['babel-loader']
        },
        {
            test:/\.js$/,
            exclude:/node_modules/,
            use:['babel-loader']
        }
    ]
}
```

还可以使用 catch-loader 来缓存我们打包的依赖
还可以使用 thread-loader 来为我们的 loader 添加线程池。

### 热替换 Hot Module Replacement

缩减的是代码改动到呈现到浏览器上的时间

使用的是 webpack-dev-server

开启热更新

```
module.exports={
    devServer:{
        hot:true
    }
}

//在index。js文件中加入
if(module.hot){
    module.hot.accecpt()
}
```

## 手动打包

手动打包的过程

1、开启 output.library 暴露公共模块
2、用 DllPlugin 创建资源清单
3、用 DllReferencePlugin 使用资源清单

手动打包的注意事项：
1、资源清单不参与运行，可以不放到打包目录文件中，2
2、记得手动引入公共 js，以避免误删除。
3、不要对小型公共 js 使用。

优点：
1、极大提升了自身模块的打包速度
2、极大的缩小了自身文件的体积
3、有利于浏览器缓存第三方文件

缺点：
1、使用非常繁琐
2、如果第三方库中存在重复代码，则效果不太理想。

## 自动打包

主要针对生产环境 ，开发环境存在热更新 不会出现这种传输问题

webpack.config.js 中存在自动打包的策略配置

```
module.exports={
    optimization:{
        splitChunks:{
            chunks:'all', //应用打包策略
            maxSize:60000, //最大字节数
            automaticNameDelimiter: ".", //新chunk名称的分隔符
            minChunks:1 ,//表示一个模块被多少个chunk 使用才会分包
            minSize:30000
        }
    }
}
```

如果设置了 maxSize 会发现有的时候回超过这个最大值 原因是 分包策略的单位是模块 ，他不会将模块在分成多个文件
当使用了 minChunks 的时候会存在一个 minSize 属性 如果引用的资源小于 minSize 值 则不会进行分包。

## 代码压缩

terser --》 webpack 内置

**副作用**
副作用：函数运行过程中，可能会对代码外部环境造成影响的功能。
如果函数包含下面的条件，则成为副作用函数：

- 异步代码
- localStorage
- 对外部数据进行修改

如果一个函数没有副作用 同时函数的返回结果仅依赖函数 则称之为纯函数 pure function

## tree shaking

因为 js 语言动态特性 webpack 无法确定确定 js 引用的依赖

如果想让 webpack 能够更好的分析依赖推荐使用下面的方式导入导出

- 使用 export 的方式 而不是使用 export default
- 使用 import {xxx} from 'xxs' 的方式导入 而不是 import xx from 'xxx'

依赖分析完毕会将那些没有使用的代码标记为 dead code 然后交给打包插件去去除 dead code

webpack 在 tree shaking 的时候遵守一条原则 就是必须要保证代码正常运行

## 懒加载

比如在我们点击一个按钮的时候使用 lodash
const \_ = import('lodash');
这个方法是 ES6 草案 浏览器不认识 但是 webpack 是认识的 它会把这个认为你要懒加载 远程读取一个 js 文件
会返回一个 promise 一个异步方式

const { xxx } = await import('lodash')
这样就能拿到里面的方法

但是问题来了 这样就失去了 tree shaking

解决 我们可以新建一个 util.js 来导出 要获取的方法
util.js

```
 export const { chunk } = require('lodash-es')
```

然后我们在使用的时候可以直接导入 util 这个工具库 变相的使用了 tree shaking

const chunk = await import('util.js')


## gzip
    