# 就业

## 组件通信

### 父子组件通信

- props
- event(emit)
- style 和 class 在父组件中为子组件设置 style 和 class 属性 会合并到子组件的根元素
- attributes 形式如 style 和 class 相同 为子组件设置 data-a 的属性 然后会放到子组件的根元素上 也可在子组件通过 this.$attrs 获取

  - ```
     <!-- 父组件 -->
        <Hello data-a="aaa" data-b="bbb" />
    <!-- 生成的子组件  Hello-->
       <div data-a=“aaa” data-b="bbb">

       </div>

       <!-- 使用this.$attrs 获取到的数据-->
       {'data-a':'aaa','data-b':'bbb'}
    ```

- native 修饰符
  - 将事件注册到子组件的根元素上 @click.native = "handleClick"
- $listeners
- v-model
- $parents 和 $children
- sync 修饰符
- $slots 和 $scopedSlots
- ref

### 跨组件通信

- provide 和 inject
- router
- Vuex
- store 模式
  - store 就是个普通的 js 通过导出的方式来让每个组件都可以访问到 且都具有修改的权限
- eventBus 事件总线

## 虚拟 dom

1、 什么是虚拟 dom
答：虚拟 dom 就是个普通的 js 对象 用来描述 html 的结构 （属性、位置、子节点）
在 Vue 中每个组件都有一个 render 函数，每个 render 函数都会返回一个虚拟 dom 树 --》每个组件都对应一个虚拟 dom 树 当组件内发生变化时 只需要重新渲染发生改变的那个组件即可。

2、为什么需要虚拟 dom
答：vue 中渲染视图会调用 render 函数， 但是在视图关联的组件进行更新的时候也会调用 render 函数，如果在渲染时直接使用真实 dom，由于真实 dom 的创建、更新、插入等操作会带来大量的性能损耗，从而就会极大的降低渲染的效率
vue 中使用虚拟 dom 主要是为了解决渲染效率的问题

3、虚拟 dom 如何转化为真实 dom
答：在组件首次渲染的时候，会先生成一个虚拟 dom 树 --》根据虚拟 dom 树的结构 创建真实 dom，在把真实 dom 挂载到对应的位置 此时 ，每个虚拟 dom 对应一个真实 dom
如果一个组件依赖的数据变化，需要重新渲染的时候，会重新调用 render 函数，用生成的新的虚拟 dom 树和旧树进行比较 来得到最小的更新量，然后 --》抛弃旧树 修改更新的 dom 节点

4、模板和虚拟 dom 的关系
答： 在 Vue 框架中有 compile 模块，负责将模板转换成 render 函数，而 render 函数调用可以生成虚拟 dom
编译过程分两步：
1- 将模板字符串转换成 AST 抽象语法树 -->这个阶段耗时比较大
2- 将 AST 转换为 render 函数

```
Vue框架中 有配置文件 vue.config.js
属性配置 runtimeCompiler：true   会将compile模块打包进文件  否则就不会
Vue项目开发环境启动使用的是预编译， 不会存在compile模块
```

模板的存在只是为了让开发人员更加便捷。
**Vue 最终运行的时候，最终需要的是 render 函数，而不是模板，因此模板中的各种语法，在虚拟 dom 中是不存在的，只会变成虚拟 dom 的配置**

## v-model 原理

答：v-model 即可以用在表单元素也可以用作自定义组件中，无论是哪一种情况，它都是一个语法糖，最终会生成一个属性和一个事件。
当作用于表单元素时：
Vue 会根据作用表单的类型生成合适的属性和事件 如：input 输入框 生成的是 value 属性和 input 事件 如果是 select 单选框或多选框类型 则生成 checked 属性和 change 事件。！
当作用于自定义组件时：
默认情况下 会生成一个 value 属性和一个 input 事件

```
<Comp v-model="data" />
<!-- 等效于 -->
<Comp :value="data" @input="data=$event" />

也可以通过在自定义组件中配置
model:{
   prop:'number',
   event:'onChange'
}
```

## 响应式原理

- 响应式数据的最终目标，是当一个对象本身或对象的属性发生变化时，将会运行一些函数，最常见的就是 render 函数

实现上：
Vue 主要用到了几个核心部件

- Observer
- Dep
- Watcher
- Scheduler

- Observer

  - Observer 要实现的目标很简单，就是把一个普通对象转换为响应式的对象
  - 为了实现这一点，Observer 把对象的每个属性通过 Object.defineProperty 转换为带有 getter 和 setter 的属性。这样一来当访问或设置属性值时 Vue 就有机会做一些事情。

  ```
  原始对象obj{a:1} -->  Observer --> obj{a:get(),set()}
  如果对象中嵌套对象 则会递归遍历
  如果数据是一个数组 或者是数组内嵌套对象  Observer 则会深度遍历数组
  ```

  - Observer 是 Vue 内部构造器， 我们可以通过 Vue 提供的静态方法 Vue.observable(object) 来把一个数据变成响应式数据
  - Observer 是发生在 beforeCreate 之后 和 created 之前 之间
  - 如果对象要新增属性 或 删除原有属性的话 响应数据是监测不到的 obj:{a:1,b:2} obj.c = 3 或 delete obj.c 这样监测不到 然后 Vue 提供了一个方案 就是新增属性的时候可以使用 set 方法 删除的时候可以使用 delete 方法

  ```
  const obj ={
     a:1,
     b:2,
     c:3
  }

  this.$set(obj,'c')
  this.$delete(obj,'c')
  ```

  - 对于数组的话 Vue 会更改他的隐式原型，因为 Vue 要监听那些可以更改数组内容的方法。
    - 数组 **_\_proto_\_** --> Vue 自定义对象 Vue 自定义对象**_\_proto_\_** --> Array.prototype

**Observer 要做的事情 就是要让一个对象 内部属性的读取、赋值、内容变换 都要通知 Vue**

- Dep
  - Dep 解决的问题是如何知道谁在用我
  - Dep 的含义是 Dependency，表示依赖的意思
  - Vue 会为响应式对象中的每个属性、对象本身、数组创建一个 Dep 实例，每个 Dep 实例都有能力做一下两件事
  * 记录依赖（是谁在用我）
  * 派发更新（我变了，我要通知那些用到我的人）
  - 当读取响应式对象的某个属性时，它会进行依赖收集：有人用到我了
  - 当改变某个属性时，它会派发更新，用到我的人注意 我的值改变了。

```
相当于
{
   a:1,
   b:2,
   c:[1,2,3],
   d:{
      aa:4,
      bb:5
   }
}

添加Dep实例
{
   //[Dep]:[render]
   a:1, // [Dep]:[render]
   b:2, // [Dep]:[render]
   c:[1,2,3], // [Dep]:[render]
   d:{
      // [Dep]:[render]
      aa:4,// [Dep]:[render]
      bb:5 // [Dep]:[render]
   }
}

当使用了依赖改变时 会看Dep中 是那个调用 然后就调用这个地方
```

- Watcher

  - Watcher 解决的问题就是 Dep 如何知道是谁在用我
  - 当某个函数执行的过程中，用到了响应式数据，响应式数据是不知道哪个函数在用自己的，Vue 通过一种办法来解决这个问题。
  - 我们不要直接执行函数，而是把函数交给 Watcher 去执行。Watcher 是一个对象。每个这样的函数执行时都应该创建一个 watcher，通过 watcher 去执行。
  - watcher 会设置一个全局变量 让全局变量记录当前负责执行的 watcher 等于自己，然后在执行函数。在函数的执行过程中，如果发生了依赖记录 dep.depend(),那么 Dep 就会把这个全局变量记录下来，表示有一个 watcher 用到了我这个属性。
  - 当 Dep 进行派发更新时，它会通知之前记录的所有 watcher：我改变了。
  - 每个 Vue 组件实例都至少对应一个 watcher，这个 watcher 记录了该组件的 render 函数。
  - watcher 会先将 render 函数运行一次来进行依赖收集，然后那些在 render 中用到的响应式数据就会记录这个 watcher
  - 当数据发生变化时，dep 就会通知该 watcher，watcher 重新运行 render 函数 ，让界面重新渲染同时重新记录当前的依赖

- Scheduler
  - watcher 收到派发更新的通知时不是立即就执行对应函数，而是把自己交给调度器 scheduler，调度器维护一个执行队列，该队列同一个 watcher 只会存在一次，队列中的 watcher 不是立即执行的，通过一个$nextTick 的方法，把这些需要执行的 watcher 放到事件循环的微队列中。
  - 首次渲染是同步的要收集依赖，当响应式数据变化时，render 函数的执行是异步的，并且在微队列中。

总体流程：
1 原始对象 交给 --> Observe 得到具有响应式 getter、setter 的对象 ，首次渲染 要运行 render 函数， 而这个 render 函数是通过 watcher 调用的，通过 函数中用到的响应式数据收集到依赖。 （用到的各种 watcher） 在 getter 中收集依赖
2、数据改变 setter 派发更新 通知 watcher --》 watcher 把自己交给 调度器 scheduler --》scheduler 会把 watcher 添加到队列 然后在把这些 watcher 放到 nextTick 中 然后异步执行 watcher 执行 代表 render 函数执行 然后重新收集依赖

## Vue diff 原理

- diff 时机
- 当组件创建时，以及依赖的属性或数据变化时会运行一个函数，该函数会做两件事
  - 1、运行 \_render 生成一颗新的虚拟 dom 树（vnode tree）
  - 2、运行 \_update 传入虚拟 dom 的根节点，对新旧两颗树进行对比，最终完成对真实 dom 的更新

```
function Vue(){
    var updateComponent = ()=>{
       this._update(this._render())
    }
    new Watcher(updateComponent)
}
```

**diff 就发生在\_update 函数运行过程中**

- \_update 函数在干什么

  - update 函数接收到一个新的虚拟 dom 树
  - update 在组件实例中通过\_vnode 属性拿到旧的虚拟 dom
  - update 首先会给组件的\_vnode 属性重新赋值 让他指向新的虚拟 dom 树
  - 然后进行 新旧两颗虚拟 dom 树的对比

- patch 函数的对比流程

  - 「相同」：是指两个虚拟节点的标签类型、key 值相同 ，input 元素还会看 type 属性
  - 「新建元素」：根据一个虚拟节点的信息，创建一个真实 dom，同时挂载到虚拟节点的 elm 属性上（表示一个虚拟节点对应一个真实 dom）
  - 「销毁元素」：指 vnode.elm.remove()
  - 「更新」：是指两个虚拟 dom 进行对比更新，仅发生在两个虚拟节点「相同」的情况下。
  - 「对比子节点」：是指对两个虚拟 dom 的子节点进行对比

  * 对比：
    - 1、对比根节点
    - 如果根节点「相同」
    - 将旧节点的真实 dom 赋值到新节点：newVnode.elm = oldVnode.elm
    - 对比新旧节点的属性，有变化的更新到真实 dom 中
    - 处理完毕，开始对比子节点
    - 2、对比子节点
    - 采用头尾指针的方式来进行对比
    - 头指针「相同」将 真实 dom 直接「更新」
    - 头指针不同尾指针相同
    - 头指针不同尾指针不同 头尾指针相同 「更新」dom 移到头指针前
    - 新的虚拟 dom 树种没有相同的 则「新建节点」
    - 就得虚拟 dom 没有 则循环遍历 销毁节点

  **阐述 Vue diff 算法**

  ```
   当组件创建和更新时，vue均会执行内部的update函数，该函数使用render函数生成的虚拟dom树，将新旧两颗树进行对比，找到差异点 更新真实dom
   对比差异的过程叫diff，Vue内部通过一个patch的过程进行对比
   对比时采用深度优先，同层比较的方式进行对比
   在判断两个节点是否相同的时候，Vue通过虚拟节点的 tag key 进行判断。
   具体来说，首先对更节点进行比对，如果相同则将旧节点关联的真实dom挂载到新节点上，然后根据需要更新属性到真实dom，然后在对比子节点数组，如果不相同
   则按照新节点的信息递归创建所有真实dom，同时挂到对应虚拟节点上，然后移除旧dom
   在对比其子节点数组时，Vue对每个子节点数组使用了两个指针，分别指向头尾，然后不断向中间靠拢来进行对比。这样做的目的是尽量复用真实dom，尽量少的销毁和创建真实dom。如果发现相同，则进入和根节点一样的比对流程，如果发现不同，则移动真实dom到合适位置
   一直递归遍历，直到整棵树完成对比。
  ```
