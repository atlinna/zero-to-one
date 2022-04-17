# webpack

## ES6、模块化、包管理器、git

## JS 工程化难题：

-效率问题： 随着工程的壮大，可能会加载成千上万个 JS 文件 ，会有很多 js 文件从网络请求来，浪费了很多请求资源。 -兼容问题： 目前浏览器仅支持 ES6 模块化的方式进行导入导出，并且还存在兼容性问题 -工具问题： 浏览器不支持 npm 下载的第三方包

## 根本原因： 在 node 端运行的文件在本地，因此可以本地读取文件，他的效率比浏览器远程传输文件高得多

## 根本原因： 在浏览器端，在开发时态（devtime）和运行时态（runtime）的侧重点不一样

# webpack

## webpack 打包 区分环境

- webpack --mode=development / production

# webpack 模块化兼容性

    - CommonJs 和 Es 6 模块化之间的兼容  会转换成{a:1,b:2,default:3} 这种形式


# 加入了div后强制让页面渲染
 - getComputedStyle(element).left 
 - 只要读取某个元素的位置或尺寸信息，则会导致浏览器重新渲染reflow
