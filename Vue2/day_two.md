# 组件开发

## 为什么会出现组件

html 开发 粗粒子 单位是整个项目
Vue 框架开发 划分为 细粒子 单位是 组件

- 组件 可以复用

组件的实质 就是一个对象

注册组件的方式

```
 let myBtn = {
     data(){
         return {
             <!-- 数据 -->
         }
     },
     template:``,//组件模板
 }

 1、全局注册 Vue.component('组件名称‘,myBtn)
 2、局部注册 Vue 中存在components 属性 来注册局部组件

```

## 命名方法

- 短横线命名发 my-btn
- 大驼峰命名法 MyBtn
  大驼峰支持短横线 但是短横线不支持大驼峰

## props 属性

- 支持 数组方式 缺点没有验证
- 对象模式 可以更灵活的对传入属性添加校验

## Vue-Cli 解决了打包问题 模板预编译

流程为：
源代码 --》 打包 --》 js 代码 --》运行
Vue-Cli 在打包的时候会将 template 转换为 render 函数 --》模板预编译
优点：

- 运行时不再需要编译模板，提高了运行效率
- 打包结果中不再需要模板的编译代码，减少了打包体积

**也就是说 如果 Vue 中还存在 template 这个属性的配置时 会报错 因为已经不存在 template 的编译器**

# 计算属性 computed

计算属性是什么？
计算属性的原理就是缓存了依赖属性的结果

为什么要使用计算属性？
比如

```
this.name = 'y'
this.lastName = 'cy'
如果我要在页面上展示全名的话可能会用到methods {{getFullName()}}
如下
methods:{
    getFullName(){
        return  this.name + ' ' + this.lastName
    }
}

但是这样的话存在一个弊端就是如果我这个重用的次数很多的话 那getFullName属性就会多次调用 浪费了渲染性能

这个时候可以使用计算属性 它会将依赖项的结果计算出来 然后进行缓存 也就是说不管重用多少次 都只计算一次结果。 只运行一次
如果 计算属性中的依赖项没有发生变化 计算属性也不会重新运行
computed:{
    fullName(){
        return this.name + ' ' + this.lastName //name 和 lastName 属性值不变的话 计算结果不变 不会重新运行
    }
}
computed 计算属性的实质就像是 defineProperty
Object.defineProperty('属性名’,{
    get(){

    },
    set(){

    }
})
computed:{
    fullName(){
        get(){
            return this.name + ' ' + this.lastName
        },
        set(val){
            <!-- 这里接受的val 就是 this.fullName='xxx' 中的xxx -->
        }
    }
}
```

**面试题：计算属性和方法有什么区别**

- 计算属性本质上是包含 getter 和 setter 方法的。
- 当获取计算属性时，实际上是在运行计算属性的 getter 方法，Vue 会收集计算属性的依赖，并缓存计算属性的结果，只有当依赖变化后才会重新计算结果。
- 方法没有缓存每次调用都会执行。
- 计算属性的 getter 和 setter 的参数是固定的 而方法的参数是不确定的 可以有多个
  **
  实际上 计算属性可以当做是属性 可以读取也可以赋值，但是 方法是一个操作 只能调用
  **

```
computed:{

}
```

### 动态绑定 class 类名

**见文档 绑定 HTML Class**

### 组件作用域

- style 中存在 scoped 属性 添加之后再生成 css 的时候模仿 css module 的方式生成一个属性 来让 css 只针对当前作用域
- 如果想要在父作用域对子组件中的样式进行修改的话可以在父组件中 style 添加 scoped 属性 子组件添加 scoped 属性 这样的话 就可以只影响子组件的根节点修改其样式

### 练习：

1、头像组件
2、图标组件
