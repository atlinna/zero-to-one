## Composition Api

不同于 reactivity api， composition api 提供的函数很多都是与组件深度绑定的，不能脱离组件而存在



### setup 函数

```
setup(props,context){
	return {}
}
```

setup 函数 你可以把它理解为一个生命周期钩子函数，只会执行一次。 setup 函数呢 执行的事件非常早，有多早呢

是在组件属性被赋值后立即执行，早于所有生命周期钩子函数

然后呢 setup 函数 是有两个参数的。

+ props
+ context

props 是一个对象，包含了所有的组件属性值，就是 传入到组件的props，由于setup函数执行的时候 没有 绑定 this 所以内部指向的是 undefined 拿不到 props 属性。

context 是一个对象，提供了组件所需要的上下文信息。 Context 内部是我们组件所需要的成员方法。很少但足够用。

context 成员：

+ attrs 同 vue2 this.$attrs
+ slots 同 vue2 this.$slots
+ emit 同 vue2 this.$emit



## 声明周期函数								

| Vue2 options api | Vue3 option api   | Vue3 composition api            |
| :--------------: | ----------------- | ------------------------------- |
|   beforeCreate   | beforeCreate      | 不再需要，代码可直接置于setup中 |
|     craeted      | created           | 不再需要，代码可直接置于setup中 |
|   beforeMount    | beforeMount       | onBeforeMount                   |
|     mounted      | mounted           | onMounted                       |
|   beforeUpdate   | beforeUpdate      | onBeforeUpdate                  |
|     updated      | updated           | onUpdated                       |
|  beforeDestory   | **beforeUnmount** | onBeforeUnmount                 |
|    destroyed     | **unmounted**     | onUnmounted                     |
|  errorCaptured   | errorCaptured     | onErrorCaptured                 |
|        -         | renderTracked     | onRenderTracked                 |
|        -         | renderTriggered   | onRenderTriggered               |

首先我们可以看到，加黑字体为，修改后的名称， Vue3 对一些声明周期的名称进行了修改，

然后我们可以看到有两个新增的 钩子函数。

+ renderTracked

  这个函数呢可以在我们执行期间查看我们页面搜集了哪些依赖

+ renderTriggered

  这个函数可以查看我们改变的依赖项

OK~ 我们来到初始项目的 HelloWorld.vue 这个文件

在这里新增一个 onRenderTracked 方法

```
onRenderTracked((e) => {
  console.log(e);
});
```

我们看到 执行结果存在两个，好，我们删掉 template 中多余的代码

```
<template>
  <h1>{{ msg }}</h1>
  <button type="button" @click="count++">count is: {{ count }}</button>
</template>
```

发现我们的依赖项 也存在两个，这个函数的作用就是帮助我们快速定位 是模板中的哪个依赖项出现了问题

我们再来看 onRenderTriggered

```
onRenderTriggered((e) => {
  console.log("triggered", e);
});
```

我们发现，页面渲染完成并没有 执行结果，这是因为我们的模板依赖项没有改变，我们尝试去修改一下，点击页面的 button。

发现 triggered 执行。