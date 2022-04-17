# loader

## loader 规则

如果有多个 loader 会先将代码交给 loader 处理得到新代码 然后在交给下一 loader 直到最后得到的代码 才会交给 AST 解析抽象语法树

## loader 配置

webpack.config.js 中 配置的是 module module 是个对象

```
module:{
    rules:[
        {
            test:'index\ .js', //匹配模块的路径
            use:[
                {
                    loader:'./loaders/test-loader.js',
                    options:{
                        changeVar:'变量'
                    }
                }
            ] //匹配到了之后使用哪些loader
        }
    ], //模块的匹配规则
    noParse:[] // 不要解析哪个模块
}
```

rules 中方的就是 我们的规则 一个规则就是一个对象{}
对象中有属性：

- test:是正则表达式 表示匹配模块的路径
- use：是符合 test 匹配到模块后使用的加载器 loaders 这是个数组 use 中的每一项就是一个加载器 loader
  - 对象{loader:'./loaders/test-loader.js'} 相当于直接使用 require('./loaders/test-loader.js')引入了 loader

## 匹配规则：

先匹配所有 loader 从数组上网下 然后将所有 loader 放到数组中 如 ['loader1','loader2','loader3','loader4']
然后会从新数组中从最后一个 loader 开始匹配规则

问题：loader 中是否可以使用 ES6 module
不可以 只能使用 COMMONJS 因为 loader 是在打包过程中运行的 环境是 node


## 通过loader 处理css
## 通过loader 处理图片