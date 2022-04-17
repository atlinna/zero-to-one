# js 兼容性 babel

- @babel/core
- @babel/cli
- .babelrc

# .babelrc 配置

```
{
    "presets":["@babel/preset-env"],

}
```

## babel 预设 @babel/preset-env

## 兼容浏览器

babel 会读取 .browserslistrc 来描述浏览器的兼容范围
默认配置如下

```
last 3 version
> 1%
not ie <= 8
```

```
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": 3
            }
        ]
    ]
}
```

如果 useBuiltIns 使用了 usage 的话 将会把没有的东西从 core-js 这个库中导入 从而支持该功能

所以需要安装 core-js 这个库\

### babel 插件

在 babel 中可能会出现同时使用了预设和插件 （presets 和 plugins）那么他们的运行顺序是什么呢
1、插件会在预设之前运行
2、插件顺序从前往后运行
3、预设顺序是颠倒的

#有一个如下额.babelrc 配置

```
{
    "presets":[
        'a','b'
    ],
    "plugins":[
        "c","d"
    ]
}
运行顺序是 源代码 --> c --> d --> b --> a --> 输出
```

### 插件

1、@babel/plugin-transform-runtime 依赖于 @babel/runtime
将编译库封装到新的文件 然后通过引入公共库的方式减少打包后的体积
