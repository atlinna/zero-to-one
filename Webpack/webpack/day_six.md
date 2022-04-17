# 自动清除插件

作用：帮助我们清除打包之后的文件 clean-webpack-plugin

# 自动引入 html

作用 帮我们生成一个 webpack 的 html 文件 html-webpack-plugin

# 复制静态资源

作用 直接复制文件夹内容到生成目录 copy-webpack-plugin

# 用于开发环境的服务

webpack-dev-server 热重启-热监听
使用方式：npx webpack-dev-server
执行过程：
1、内部执行 webpack 命令，传递命令参数。
2、开启 watch
3、注册 hooks（钩子函数），类似于 plugins，webpack-dev-server 会向 webpack 中注册一些钩子函数主要功能住下：

- 将资源列表（assets）保存起来
- 禁止 webpack 输出资源列表 compliation.assets = {}
  4、用 express 开启 一个服务器，监听某个端口，请求到达后 ，根据请求的路径，给与响应的资源内容。

# webpack.config.js devServer 配置

    - port 表示express 服务器监听的端口号
    - open 是否自动打开浏览器
    - index 表示域名端口号后的请求路径
    - proxy 代理  帮助我们解决开发环境请求跨域问题。

## proxy 代理原理

跨域只发生在浏览器环境 ，所以解决这个问题的重点就在于 webpack-dev-server 中 proxy 是在 node 环境下请求
接口 然后再将请求到的结果返回给我们

```
proxy 配置
devServer:{
    proxy:{
        '/api':'http://open.duyi.com',
    }
}
如果服务器识别主机名 host的话
devServer:{
    proxy:{
        '/api':{
            target:"http://open.duyi.com",
            changeOrigin:true, //更改请求头中的origin
        }
    }
}
```

# stats 指的是我们 webpack-dev-server 中的一些配置

- modules：false --》不显示模块信息
- colors：true --》显示颜色

# 路径问题

publicPath 解决路径问题 原理是通过将配置的 publicPath 拼接到插件生成的文件路径前面
file-loader 解决图片引入问题

# webpack 内置插件 (结觉一些 webpack 中比较微笑的问题)

所有的 webpack 内置插件都作为 webpack 的静态属性存在，使用下面额方式可以创建一个插件对象。

```
 const webpack = require('webpack');
 new webpack.插件名(option)
```

### DefinePlugin

作用：相当于定义了一个全局的常量

```
new webpack.DefinePlugin({
    PI:"Math.PI",
    VERSION:`"1.0.0"`,
    DOMAIN:JSON.stringify("atlinna.top")
})
```

打包编译时 在 AST 抽象语法树阶段 会将所有的属性替换成对应的值。

### BannerPlugin

作用 在生成的 chunk 前添加一段注释 一般用于公司版权，个人等

```
new BannerPlugin({
    banner:`
        hash:[hash]
        chunkhash:[chunkhash]
        name:[name]
        author:lucas
        company:chenyu
    `
})
```

### ProvidePlugin

作用 将模块导出为全局变量
