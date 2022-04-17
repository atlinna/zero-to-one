# webpack 编译结果分析

## webpack 将多个模块编译合并成一个文件

## 编译原理

- 将所有模块内容全部放到函数环境中 整合成对象 属性名是路径 属性值是这个函数
- 类似于这种格式{'./src/common/a.js':function (module,export,require){console.log('a.js')}}
- 函数可以接收三个参数 module,exports,require
- module 只是个对象

## webpack 编译源码 简易版

```
(function (module) {
  var installed = {};
  function webpack_require(moduleId) {
    if (installed[moduleId]) {
      return installed[moduleId];
    }
    var modules = {
      exports: "",
    };
    var func = module[moduleId];
    func(modules, modules.exports, webpack_require);
    var ret = modules.exports;
    installed[moduleId] = ret;
    return ret;
  }
  webpack_require("./src/index.js");
})({
  "./src/a.js": function (module, exports, require) {
    var a = "hello a";
    console.log(a);
    module.exports = a;
  },
  "./src/b.js": function (module, exports, require) {
    var b = require("./src/a.js");
    console.log("this is b", b);
    module.exports = b;
  },
  "./src/index.js": function (module, exports, require) {
    require("./src/b.js");
  },
});

```

## 配置文件

默认情况下 webpack 会默认读取 webpack.config.js 这个文件作为 config 文件 或者使用 --config 来制定配置文件

## webpack.config.js 必须使用 commonjs 的方式进行导出

原因： webpack 的编译过程是处于 nodejs 环境下 这个时候 我们写的代码并不会运行 也就是说只遵循一种 也就是 commonjs 模块化规范
！配置文件中的代码必须是有效的 node 代码
如果 配置文件和命令行有参数冲突 则以命令行为准

- mode: 编译模式 development \ production
- entry: 入口文件
- output: 对象 输出文件
- devtool:'source map'
