# 插槽

## slot

帮助我们传递插槽中的内容到父组件

- 插槽的内容 如果不指定 传入的是默认插槽
- 具名插槽 是指定名字的插槽
- 通过 v-slot:default 的方式来放入指定插槽内
- <template v-slot:default></template>
- <template #default></template>

# Vue router

- vue-router 提供了三种路由模式
- hash 默认值 路由从地址栏中的 hash 部分获取路径，改变路径也是改变 hash 部分的路径，该模式兼容性最好。
- history 路由从浏览器地址栏的 location.pathname 获取，改变路径使用的是 H5 的 location Api location.pushState(null,null,'/about')
- abstract 路由从内存中获取路径，改变路径也只是改动内存中的值 通常用在非浏览器环境中。

## 知识点

1、vue 中开启 Css Module

- 将文件命名为 xxx.module.css 即可

2、得到组件生成的根 dom
export function getComponentDom(comp, property) {
const vm = new Vue({
render: (h) => h(comp, { props: property }),
});
vm.$mount();
  //   console.log(vm);
  return vm.$el;
}

3、向实例注入成员
Vue.prototype.$show = xxx;

4、ref
组件或 dom 元素属性 refs = ""

## axios 可以拦截请求

Interceptors
**http://www.axios-js.com/docs/**

# 组件声明周期

- beforeCreate
  || --> 注入
- created
  || --> 生成 VNode
- beforeMount
  || --> 挂载 --> 数据更新 |--> 触发 beforeUpdate -->更新完成 |--> 触发 updated --> 重新挂载
- mounted
  ||
- beforeDestroy
  ||
- destoryed

# 指令

## 定义指令

- 全局定义

  - Vue.directive('myDirective',{
    binding(el,binding){

        }

    inserted(el,binding){

    }
    update(){

    }

    })

## 组件混入

mixins:[]
可通过导出一个对象来混入公共代码 或者导出一个函数返回一个对象的方式混入代码

## 组件递归

- 设置组件的 name 属性
- 在需要嵌套循环的地方使用该 name name="CorlorList" <ColorList />

## 监听器 watch

```
watch:{
    $route:{
        handler(){

        },
        immediate:true|false //表示是否初始化立即执行一次
        deep:true|false, 是否监听数据内部属性的变化
    }

}

```

## 小技巧

- 如何点击分页的时候滚动条滚动到顶部 this.$refs.scrollView.scrollTop = 0
- 平滑的滚动 css scroll-behavior：smooth

## Vue 动态传入组件

- 实验一
  设计一个中间件 MidWare 通过获取组件根 dom 、 v-html 指令来动态传入组件
  获取 outerHTML

## $listener

$listeners 可以获取到父组件传入子组件的事件

## v-model

双向绑定
实质就是 <input :value="xxx" @input="$event.target.value" />

# 组件通信

- props
- router
- event（$emit）
- $listeners
- $refs
- 事件总线 new Vue({})[ $on $off $emit]
