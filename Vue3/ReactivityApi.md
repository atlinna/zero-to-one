## Reactivity Api

何为 Reactivity Api？

这是 Vue3 中的 重中之重

他涵盖了 Vue3 中的响应式功能

Vue2中是如何实现数据响应的？

我们是要配置一个 data 对象，这个对象自动的就会变成响应式对吧 这个过程叫 **注入**

但是 Vue3 不同，它相当于将响应式这个概念抛出来，也就是我们的 reactivity api，我们通过调用 reactivity api 来使我们的数据变为响应式数据。

+ reactive
+ readonly
+ ref
+ computed

------

-- reactive

-作用：深度代理对象中的所有成员，

-类型：对象代理

```
import { reactive } from "vue";
const obj = { a: 1, b: 2 };
const state = reactive(obj);
```

这样我们就能得到一个代理对象 state。

如果我们创建一个数值，一个常量。然后通过 reactive 来进行代理，看会发生什么。

```
import { reactive } from "vue";
const obj = { a: 1, b: 2 };
const count = 1;
const state = reactive(obj);
const state1 = reactive(count);
console.log(state);
console.log(state1);
```

并不会报错，但是 Vue 给了我们一个警告， value cannot be made reactive，

他说啊 这个类型不能被 reactive 代理。

通过 state 我们可以发现：

state.a 是 1，

state.b 是 2，

state 是一个 Proxy， 是一个代理对象，它代理的使我们的普通对象，由于它是一个 Proxy，所以 如果我们为 state 的成员进行赋值，他是可以收到通知的。

通过上面的例子我们还可以观察到，我们实现一个响应式并没有依赖组件，以前 vue2 的时候我们需要配置 data 对象，但是现在呢 ？ 连组件的一根毛都没看见，也就是说现在的 响应式完全是抽离出来，与组件没有任何关系的。



------

-- readonly

-作用：只能读取代理对象中的成员，但是不能修改

-类型：对象代理（可以传入一个对象或者一个 proxy）

```
const objOnly = readonly(obj);
objOnly.a = 2;
console.log(objOnly);
```

我们可以看到控制台上输出了警告，意思是给 a 属性赋值失败，因为目标是一个只读的。

```
const stateOnly = readonly(state);
state.a = 2;
console.log(stateOnly);
```

我们看这个例子，通过 readonly 代理 state，然后修改 state 的属性 a。

没有警告，赋值成功对吧，

因为 stateOnly --> 代理的 state --> 代理的 对象 obj

所以如果对象 obj 或者 state 改变 stateOnly 都会跟着改变

------

-- ref

首先先来说一下为什么会有 ref 这个东西存在，因为我们前面已经看到，reactive，readonly存在，且可以将我们的数据变为响应式了对吧？那为什么还要有 ref 呢？

可以想到的是，随着我们 reactivity api 的抽离，肯定会有一些数据 如一个 number 啊 一个string 字符串啊 这样的数据代理，但是我们上面已经实验过 reactive 不能够对非对象的数据进行代理。 所以 ref 出现了，目的就是解决我们代理 普通数据的需求。

ref 的原理就是创建一个对象，然后把值放到对象的 value 属性里面。

我们学习过 Es 6 知道了 对象中存在访问器 getter 和 setter

```
{
	get value(){
		...
	},
	set value(val){
	  ...
	}
}
```

那么 ref 的实质是什么？ 无非就是通过访问器实现，当你读取的时候使用 get 方法，然后当你赋值的时候 运行 set 方法。但是不是盲目的赋值，会判断一下数据的类型。

**如果数据是一个 proxy。**

那么直接将 value 的值赋值为这个代理，没有必要创建一个代理去代理它对吧

我们可以看下

```
const stateRef = ref(state);
console.log(stateRef.value === state);
```

我们看到结果是 true 对吧。

**如果数据是普通类型。**

普通数据的话，vue 会创建一个对象，然后将这个值赋给 value 属性，然后返回这个代理。

这样就完成了普通数据的响应式。

**如果数据是一个对象。**

如果是对象的话就不能直接想普通对象一样操作了，因为 赋值给 value 对象后，value 还是一个普通的对象，无法进行响应式 对吧？外面是代理，里面是对象，相当于啥也没干···

所以呢 这个时候，它会调用一下 reactive 将对象变为代理。

------

-- computed

computed 呢也很常用，它呢接收一个函数，然后根据情况来判断是否会运行

-类型：返回的是一个代理

什么叫根据情况来判断是否会运行呢？

```
const sum = computed(() => {
  console.log("start it");
  return state.a + state.b;
});

console.log(sum.value);
console.log(sum.value);
```

现在呢我们新增一个 computed 让他求和 state 中的 ab 属性，我们看下 computed 的函数会运行几次呢？

答案是1次！

为什么会这样呢？

vue 会收集依赖，同时缓存这个结果，当我第一次运行的时候，会执行函数搜集这个依赖，依赖的 state 中的 a,b 属性。返回我们的代理结果。

当我们第二次运行的时候，vue一看 诶 哥们 你这没有变化呀，那我把之前的结果给你吧！

那么什么时候会再次运行呢？ 是不是当我们函数中依赖的响应式数据发生变化才会执行

也就是 state.a 或 state.b 发生变化的时候。

```
console.log(sum.value);
state.b = 3
console.log(sum.value);
```

完美运行。

------

使用 reactive(...) 的到的 是一个 代理对象

const state = reactive({a:1,b:2}) // state 是一个代理

如果使用 ref(...) 得到的是一个 代理对象

const stateRef = ref({a:1,b:2}) // stateRef.value 是一个代理

两种形式

+ 如果想让一个对象变为响应式数据，可以使用 reactive 或 ref
+ 如果想让一个对象的所有属性只读，可以使用 readonly
+ 如果想让一个非对象数据变为响应式数据，可以使用 ref
+ 如果要根据已有的响应式数据得到一个新的响应式数据，可以使用 computed

------

ok 接下来我们联系一下

Problem -1

请问下面 console.log 输出了什么

```
import { reactive, readonly, ref, computed } from "vue";

const state = reactive({ firstName: "Xiao Ming", lastName: "Wang" });

const fullName = computed(() => {
  console.log("changed");
  return `${state.lastName},${state.firstName}`;
});
console.log("state ready");
console.log("fullname is", fullName.value);
console.log("fullname is", fullName.value);

const imState = readonly(state);
console.log(imState === state);

const stateRef = ref(state);
console.log(stateRef.value === state);

state.firstName = "Xiao Hong";
state.lastName = "Li";

console.log(imState.firstName, imState.lastName);
console.log("fullname is", fullName.value);
console.log("fullname is", fullName.value);

const imState2 = readonly(stateRef);
console.log(imState2.value === stateRef.value);
```

可以自己写出来然后对照一下



Problem - 2

补全 useUser 函数

```
import { reactive, readonly, ref, computed } from "vue";

function useUser() {
  // 在这里补全函数
  return {
    user, // 这是一个只读的用户对象，响应式数据，默认为一个空对象
    setUserName, // 这是一个函数，传入用户姓名，用于修改用户的名称
    setUserAge, // 这是一个函数，传入用户年龄，用户修改用忽的年龄
  };
}

```

答案：这里 reactive 或者 ref 都是可以的 注意好 不要自己乱了就行 因为 ref 的 value 属性才是代理。

```
import { reactive, readonly, ref, computed } from "vue";

function useUser() {
  // 在这里补全函数
  const userProp = reactive({});
  const user = readonly(userProp);
  const setUserName = (name) => {
    userProp.name = name;
  };
  const setUserAge = (age) => {
    userProp.age = age;
  };

  return {
    user, // 这是一个只读的用户对象，响应式数据，默认为一个空对象
    setUserName, // 这是一个函数，传入用户姓名，用于修改用户的名称
    setUserAge, // 这是一个函数，传入用户年龄，用户修改用忽的年龄
  };
}

let u = useUser();
const { user } = u;
console.log(user);
console.log(user.name);
u.setUserName("Lisa");
console.log(user.name);
```

Problem - 3

响应式数据防抖

```
import { reactive, ref, readonly } from "vue";

function useDebounce(obj, duration) {
  const origin = reactive(obj);
  const value = readonly(origin);
  let timer = null;
  const setValue = (val) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      Object.entries(val).forEach(([k, v]) => {
        origin[k] = v;
      });
      console.log(value)
    }, duration);
  };

  return {
    value,
    setValue,
  };
}
```

------

### 监听

+ watchEffect

  watchEffect 接收一个函数，函数呢， 首先会执行一次，同时搜集依赖，如果依赖项改变，则会再次执行函数

  ```
  import { reactive, watchEffect } from "vue";
  
  const stateOrigin = reactive({ a: 1, b: 2 });
  
  const stop = watchEffect(() => {
    console.log(stateOrigin.a);
  });
  
  stateOrigin.a++;
  
  stop()
  ```

  这里呢 如果 执行 stop 则会终止 watchEffect

+ watch

  同 Vue2 中的 $watch

  首先我们看下 watch 如何去监听数据

  ```
  import { reactive, watchEffect, watch } from "vue";
  
  const stateOrigin = reactive({ a: 1, b: 2 });
  
  watch(stateOrigin, (newValue, oldValue) => {
    console.log("new", newValue.a, "old", oldValue.a);
  });
  
  stateOrigin.a++;
  
  ```

  我们看到结果 新旧值是一个样的 这是为什么 因为我们监听的是一个代理对象。那么我们试试去监听它里面的值达到我们想要的效果。

  ```
  watch(stateOrigin.a, (newValue, oldValue) => {
    console.log("new", newValue.a, "old", oldValue.a);
  });
  
  ```

  但是当我们将监听改为监听 stateOrigin 的 a 属性时，vue 给了我们一个警告，意思是我们不能监听一个 1，哦 原来 它会现将这个表达式算出来，再改一改,既然它会计算这个表达式，那我们就使用函数返回这个 a 属性

  ```
  watch(
    () => stateOrigin.a,
    (newValue, oldValue) => {
      console.log("new", newValue, "old", oldValue);
    }
  );
  
  stateOrigin.a++;
  ```

  测试成功！

  ok 当然你也可以直接监听一个 ref

  ```
  import { reactive, watchEffect, watch, ref } from "vue";
  
  const stateOrigin = reactive({ a: 1, b: 2 });
  const countRef = ref(0);
  
  watch(
    () => countRef.value,
    (newValue, oldValue) => {
      console.log("new", newValue, "old", oldValue);
    }
  );
  
  countRef.value++;
  
  ```

  注意 这里 我们可以直接监听一个 ref 因为 他是一个对象，可以被监听

  ```
  watch(
    countRef,
    (newValue, oldValue) => {
      console.log("new", newValue, "old", oldValue);
    }
  );
  
  countRef.value++;
  
  ```

  同时 watch 是可以监听多个属性的

  ```
  import { reactive, watchEffect, watch, ref } from "vue";
  
  const stateOrigin = reactive({ a: 1, b: 2 });
  const countRef = ref(0);
  
  watch(
    [countRef, stateOrigin],
    ([newValue1, newValue2], [oldValue1, oldValue2]) => {
      console.log("new1", newValue1, "old1", oldValue1);
      console.log("new2", newValue2, "old2", oldValue2);
    }
  );
  
  countRef.value++;
  stateOrigin.a++;
  
  ```

  Watch 和 watchEffect 都是 微队列 异步执行的 全部是等到你的 依赖项执行完毕，然后才会执行监听里面 的回调函数。

  然后 什么情况下建议使用 watch 呢

  + 如果 你不希望监听一上来就执行，使用 watch
  + 如果 你希望得到旧值，使用 watch
  + 如果要同时监听多个值

  否则 都使用 watchEffect



**判断：**

+ isProxy 判断某个数据是否是 reactive 或 readonly
+ isReactive 判断某个数据是否是通过 reactive 创建的
+ isReadonly 判断某个数据是否是通过 readonly 创建的
+ isRef 判断某个数据是否是一个 ref 对象



**转换：**

+ unRef 等同于 isRef(ref)? ref.value:value

+ toRef 得到一个响应式对象某个属性的 ref 格式

  ```
  const stateOrigin = reactive({ a: 1, b: 2 });
  const countRef = ref(0);
  
  const aRef = toRef(stateOrigin, "a");
  console.log(aRef.value)
  
  ```

  就相当于将 reactive 中的属性值拿出来然后创建了一个 ref

+ toRefs() 将一个对象中的所有成员都变为 ref

  ```
  setup(){
  	const state1Origin = reactive({a:1})
  	const state1Origin = reactive({b:2})
  	
  	return{
  	  ...state1Origin, // lose reactivity
  	  ...state2Origin, // lose reactivity
  	}
  }
  ```

  如上,我们在 setup 中 会遇到合并的需求，但是这样一扩展出来 就变成了普通对象，失去了响应式

  这个时候我们怎么做呢，我们是不是可以给要扩展的对象用 toRefs包起来 这样，合并之后每个成员都是一个 ref。

  ```
  setup(){
  	const state1Origin = reactive({a:1})
  	const state1Origin = reactive({b:2})
  	
  	return{
  	  ...toRefs(state1Origin), // lose reactivity
  	  ...toRefs(state2Origin), // lose reactivity
  	}
  }
  ```

  

