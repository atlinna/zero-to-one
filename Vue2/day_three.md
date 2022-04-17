# 组件式开发

## 小技巧

- 在 css 中可以使用~@ 表示 src 目录
- 在 js 中使用@表示 src 目录

## 问题 v-if 和 v-show 有什么区别

```
 v-if能够控制是否生成vnode，简洁控制了是否生成dom元素。 只有当v-if为true的时候才会生成vnode和dom元素。
 v-show始终都会生成vnode，也就是说不管怎样都会生成dom元素，它只是控制dom的display属性，当v-show为true时不作任何处理，为false的时候dom的display属性为none

 作用：
 v-if可以有效的减少树的节点和渲染量。但也会导致树的不稳定。v-show不会导致树的不稳定 但是无法减少节点和渲染量。

应用：
 开发中显示状态频繁变化的应该使用v-show 来保证树的稳定，变化少的应使用v-if来减少渲染量

```

# 组件通信

- 父组件流向子组件
- 子组件没有权利更改父组件的数据

# 组件事件

父组件 --》 数据 --》子组件
子组件 --》 事件 --》是否修改数据 --》 父组件

定义事件
@click="handleClick"
@click="handleClick($event)"

需要用到 vue 的实例成员
$emit -- 表示抛出一个事件

```
子组件抛出事件 让父组件接收
this.$emit('事件名--pageChange',传递的参数--val)；

父组件接收到 子组件抛出的事件然后 注册事件对事件进行处理
@pageChange="注册的事件名($event)"

```

### 练习

- 分页组件 Pager

  - 属性：
    - current -- 当前页面
    - total -- 总数据
    - limit -- 页容量
    - visibleNumber -- 可见页码数

- Empty

  - 属性：
    - content -- 内容

- ImageLoader
- Contact
- Menu
- SiteASide
