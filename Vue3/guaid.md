## Vue3 -- composition API

经过一段时间的沉沦，决心开始分发图强，争取给自己一个好的结果。

惶惶世人，可知警钟已在怒雷中长鸣！



**正题**

我们会来了解的是 Vue3 在 Vue2的哪些升级变化，以及他的核心思想API



这里我们使用 vite 创建 vue3 工程

```
npm init vite 'name'
```

这里如果小伙伴们的 npm 版本过低可能会提示你更新 npm 

+ 首先我们看到第一处不同的地方 在 main.js

  ```
  import { createApp } from 'vue'
  import App from './App.vue'
  
  createApp(App).mount('#app')
  ```

  我们之前 vue2 中的写法是先通过 vue创建 vue 实例 然后通过$mount方法挂载到节点

  ```
  import Vue from 'vue'
  
  // ...
  new Vue({}).$mount('#app')
  ```

  这意味着我们 vue2 项目不能放到 vue3 上继续跑  breaking -- 截断思想

然后我们来到组件

+ 首先先试一下我们原始写法是否还支持，我们编写了一个组件 creasebtn 通过点击增加count值

```
<template>
  <button @click="increase">{{ count }}</button>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    increase() {
      this.count++;
    },
  },
};
</script>

```

经过实验，原始写法完美运行 好 完结撒花~ 哈哈哈  it's a joke。

+ 然后我们看下 composition api 会给我们带来哪些惊喜。

  + 首先是 我们的 setup
    + setup 在我们所有的生命周期钩子函数之前调用
    + setup 中没有 this  this --》指向的 是 undefined

  ```
  <template>
    <button @click="increase">count:{{ count }}</button>
  </template>
  
  <script>
  export default {
    setup() {
      let count = 0;
      const increase = () => {
        count++;
      };
  
      return {
        count,
        increase,
      };
    },
  };
  </script>
  ```

  ok 写好组件 我们就来测试一下，当我们点击 button 的时候，讲道理 count 应该是 增加的 可是 啊嘞嘞~ 事与愿违 没有变化

  我们在 increase 中 打印个 log 试试

  ```
  const increase = () => {
  			console.log(1)
        count++;
      };
  ```

  结果发现我们的 increase 函数确实运行了，count也确实增加了这是什么原因？

  是不是因为我们的 count 改变没有触发页面的改变，从本质来说是不是 count 不是一个响应式变量啊？

  他就是一个普普通通的一个变量而已···

+ 这里我们就来介绍第二位成员 ref  为了规范命名 一般都会在变量名之后加个 Ref 表示我们创建了一个 ref

  我们先来简单的修改一下代码

  ```
  setup() {
      let countRef = ref(0);
      const increase = () => {
        countRef++;
      };
  
      return {
        countRef,
        increase,
      };
    },
  ```

  ok 我们满怀信心再次点击我们的按钮 button ，TMD 怎么还是一个鸟样子，没有任何反应对吧？

  我们要先来理解一下新版 vue 的特性

  首先我们新增一个 mounted 声明周期 ，这里面我们就能访问到我们的 vue 实例的

  ```
  <template>
    <button @click="increase">count:{{ countRef }}</button>
  </template>
  
  <script>
  import { ref } from "vue";
  export default {
    setup() {
      let countRef = ref(0);
      const increase = () => {
        countRef++;
      };
  
      return {
        countRef,
        increase,
      };
    },
    mounted() {
      console.log(this);
    },
  };
  </script>
  
  ```

  我们打印出 this 看到 vue 实例是什么，像不像 ES6 的 Proxy 一个代理对象对吧

  同理 我们在 setup 中打印出我们的 countRef

  ```
  let countRef = ref(0);
      console.log(countRef)
      const increase = () => {
        countRef++;
      };
  ```

  我们会发现，countRef 竟然是一个对象！我们看到 countRef中 存在一个 value 属性这个 value 属性就是我们创建出的 ref 的值

   但是我们访问的时候明明可以直接访问到值，这个是作者为了不让我们在使用中这么繁琐 给出的一点点小福利把算是。

  所以，如果想让页面也改变需要在 increase 方法中做一点小小的改变

  ```
   const increase = () => {
        countRef.value++;
      };
  
  ```

  因为我们创建的 ref 是个对象 而且我们能拿到的 是这个对象的 value 属性的值对吧

  有关与 ref 的相关原理 会有对应的讲解 不要急~~

  go on~

+ 欢迎我们的第三位成员 watchEffect，这个成员呢比较特殊

  我们为什么说他特殊呢，watchEffect 是一个函数，然后呢 参数接收的也是一个函数

  作用是和 $watch 相似 当我们这个传入的函数中的 依赖变化的时候，传入的函数就会运行。

  我们知道 vue 是可以搜集依赖的对吧 现在呢 我们的依赖项变成了 ref 它来给我们提供依赖 这样可以懂吧，当我们创建的 ref 发生改变时 会触发我们 watchEffect 中函数的执行。

  Like this

  ```
  <template>
    <button @click="increase">count:{{ countRef }}</button>
  </template>
  
  <script>
  import { ref, watchEffect } from "vue";
  export default {
    setup() {
      let countRef = ref(0);
      let arr = [];
      const increase = () => {
        countRef.value++;
      };
  
      watchEffect(() => {
        arr.push(countRef.value);
        console.log(arr);
      });
  
      return {
        countRef,
        increase,
      };
    },
  };
  </script>
  ```

  我们点击函数触发 increase 函数执行，increase 函数会改变 countRef 的 value 值，同时 我们 watchEffect 能够收到 countRef 改变的消息 执行函数 arr 数组就会添加 countRef 的 value 值，打印 arr

+ 下一位 onMounted 听到名字就知道 和 mounted 生命周期相关哈

  onMounted 接收一个函数

  ```
  onMounted(() => {
        console.log("mounted here");
      });
  ```

+ onUnmounted 这个是组件销毁事件

  ```
  onUnmounted(() => {
        console.log("unmounted here");
      });
  ```

+ 然后我们介绍 computed 成员

  这个computed 和 Vue2 中的是相似的 都有两种方式来实现，而且 我们 composition api 中的 computed 成员返回的也是经过 ref 包装过后的响应式数据。

  ```
  const stepA = computed(() => {
        return countRef.value + "-a121";
      });
  ```

  ```
  const stepB = computed({
        get() {},
        set(val) {
        },
      });
  ```

  

