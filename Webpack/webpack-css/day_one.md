# css 的问题 （为什么要工程化 -- 工程化中遇到的问题）

1、类名冲突 类名层级嵌套太深 影响打包文件的大小
2、重复的样式问题 ， 多个文件样式重复 难维护
3、css 文件细分

# 问题的解决

1、解决类名的冲突：
css in js 将 css 当做一个对象进行编写 这样就会有类名 也就不会出现类名的冲突问题。
2、解决样式重复问题：

- 使用 css in js 的方式
- 预编译器 仅支持 css 原理是在打包前先将 css 代码进行预编译 --》 生成普通的 css 代码  
  3、解决 css 文件细分问题：
  通过 loader 和 plugins 来解决

## css 文件细分问题

1、css-loader

```
.red{
    background:#f40;
}

通过cssloader 处理后变成
module.exports = `
    .red{
    background:#f40;
}
`
```

2、style-loader
作用 是将 css-loader 导出的样式放到标签上。
注意 应用顺序应该是要先交给 css-loader 处理然后在使用 style-loader

## 解决类名冲突

命名规范：BEM
BEM 是一套针对 css 类样式的命名方法
其他命名方法还有 AMCSS、OOCSS、SMACSS

## Css Module

开启方式是 css-loader 中 配置一个 module：true 即可
原理是 css module 会根据模块的路径和文件名生成一个 hash 值 并且会导出类名与生成的 hash 类名的关系表 解决了css 类名冲突的问题

css module 仅处理顶级类名 不能处理嵌套类型。


## mini-css-extract-plugin 生成css文件
