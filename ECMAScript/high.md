# Javascript - 高阶函数
这一章主要给大家介绍一下 Javascript 中的高阶函数， 在 Javascript 中，函数是一种特殊类型的对象，称为 Function Objects。


### 高阶函数
什么是高阶函数呢？如何判断一个函数是不是高阶函数？
高阶函数要满足以下两个条件：
+ 接受一个或多个函数作为输入
+ 输出一个函数

就是说高阶函数是对其他函数进行操作的函数，可以将他们作为参数传递，或者是返回他们。 
总结起来就是，高阶函数是一个接受函数作为参数或将函数作为返回值输出的函数。


### 内置高阶函数（built-in）
Javascript 语言内置了一些高阶函数，比如 Array.prototype.map, Array.prototype.filter, Array.prototype.reduce, 他们接受一个函数作为参数，并应用这个函数到列表的每一个元素。
接下来我们对比一下使用高阶函数和不使用高阶函数。

**Array.prototype.map**  
map 方法创建一个新的数组，返回的结果是该数组中的每项都调用一个提供的函数后返回的结果，原数组不会改变，原数组不会改变。 传递给 map 的回调函数有三个参数，分别是 item（项），index（索引、可选），self（自身数组、可选），map 方法除了可以接受一个回调函数外还能接受一个 this 值（可选），用来执行回调函数中使用的 this。

练习：我们要生成一个新数组，数组中的每一项都是 arr 中的每一项的两倍。
```
<!-- 不使用高阶函数 -->
var arr = [1, 2, 3, 4];
var brr = []

for (var i = 0; i < arr.length; i++) {
    brr.push(arr[i] * 2)
}

console.log(brr, arr); //(4) [2, 4, 6, 8] (4) [1, 2, 3, 4]


<!-- 使用高阶函数 -->
var arr = [1, 2, 3, 4];

var brr = arr.map(function (item, index, self) {
    return item * 2
})

console.log(brr, arr); //(4) [2, 4, 6, 8] (4) [1, 2, 3, 4]
```

**Array.prototype.filter**  
filter 方法创建一个新数组，其包含通过提供函数实现的过滤元素，原数组不会改变。参数同 map 相同，返回值是个新数组、 数组中是由符合条件的项构成，如果都不符合，则数组为空。

练习：
现有一个数组 [1,2,3,1,2,3,1,1,1,2,3,4,5,6,2,2,4,5] , 我们想要生成一个新数组，这个数组要去重（去掉重复的内容）。
```
<!-- 不使用高阶函数 -->
var arr = [1, 2, 3, 1, 2, 3, 1, 1, 1, 2, 3, 4, 5, 6, 2, 2, 4, 5];

var brr = [];

for (var i = 0; i < arr.length; i++) {
    if (brr.indexOf(arr[i]) === -1) {
        brr.push(arr[i])
    }
}

console.log(brr, arr); // (6) [1, 2, 3, 4, 5, 6] 


<!-- 使用高阶函数 -->
var arr = [1, 2, 3, 1, 2, 3, 1, 1, 1, 2, 3, 4, 5, 6, 2, 2, 4, 5];

var brr = arr.filter(function (item, index, self) {
    return self.indexOf(item) === index;
})

console.log(brr, arr); // (6) [1, 2, 3, 4, 5, 6] 
/*
  解析：
  为什么这样可以去重？
  因为 self 代表的是原数组本身 也就是 arr 
  arr.indexOf(item) 返回的是第一个符合元素的索引
  也就是说只要不重复那么 arr.indexOf(item) 的值就会等于 index
*/

```

**Array.prototype.reduce**  
reduce 方法对数组中的每个元素执行一个传入的 callback 函数，并返回单个的经过 callback 处理过的结果。传递给 reduce 的回调函数 callback 接受四个参数，分别是 prev（累加器 | 前一个结果）,
item（遍历项），index（索引），self（数组本身），reduce 除了接受一个回调函数 callback 外，还会接受一个**初始值 initialValue**。
+ 如果没有提供 initialValue，在第一次调用 callback 函数时，prev 使用原数组中的第一个元素，item 则是数组中的第二项。如果调用 reduce 的数组是空数组，则会报错。
+ 如果提供了 initialValue ，那么 initialValue 将会在 reduce 调用的第一次作为 prev 的值，item则是数组第一项。

练习：
现有一数组 arr = [1,2,3,4,5] 将数组内的每一项相加 计算 数组中的合
使用高阶函数：
```
var arr = [1, 2, 3, 4, 5]

/**
 * prev 前一项
 * item 遍历项
 * index 索引
 * self 数组本身 --》 arr
 */
var ret = arr.reduce(function (prev, item, index, self) {
  return prev + item
}, 0)

console.log(ret); // 15
/*
  计算过程：
  第一次 因为 我们传入了 initialValue
  prev = 0, item = 1 相当于 prev = prev + item
  第二次 
  prev = 1 item = 2 prev = prev + item
   ·
   ·
   ·
  prev = 10 item = 5 prev = prev + item
  return prev
*/
```
不使用高阶函数:
```
var ret2 = 0
for (var i = 0; i < arr.length; i++) {
  ret2 += arr[i]
}

console.log(ret2); // 15
```
### 函数作为返回值输出
这个很好理解，就是函数中返回一个函数。

#### isType 函数
通常，我们在判断类型的时候 会使用 Object.prototype.toString.call() 来得到对应对象的返回值，通过这个返回值来确定我们的数据类型。
```
    console.log(Object.prototype.toString.call(1));                         // [object Number]
    console.log(Object.prototype.toString.call('str'));                     // [object String]
    console.log(Object.prototype.toString.call(true));                      // [object Boolean]
    console.log(Object.prototype.toString.call(Symbol('1')));               // [object Symbol]
    console.log(Object.prototype.toString.call(null));                      // [object Null]
    console.log(Object.prototype.toString.call(undefined));                 // [object Undefined]
    console.log(Object.prototype.toString.call({}));                        // [object Object]
    console.log(Object.prototype.toString.call([]));                        // [object Array]
    console.log(Object.prototype.toString.call(function () { }));           // [object Function]
    console.log(Object.prototype.toString.call(new Date()));                // [object Date]
```
我们发现通过这个对立关系可以封装一个判断数据类型的函数
于是：
```
function isType(type) {
  var isType_t = '';
  switch (type) {
    case 'number':
      isType_t = '[object Number]';
      break;
    case 'string':
      isType_t = '[object String]';
      break
    case 'boolean':
      isType_t = '[object Boolean]';
      break;
    case 'symbol':
      isType_t = '[object Symbol]';
      break;
    case 'null':
      isType_t = '[object Null]';
      break
    case 'undefined':
      isType_t = '[object Undefined]';
      break;
    case 'object':
      isType_t = '[object Object]';
      break
    case 'array':
      isType_t = '[object Array]';
      break
    case 'function':
      isType_t = '[object Function]';
      break
    case 'date':
      isType_t = '[object Date]';
      break
  }
  return function (params) {
    return Object.prototype.toString.call(params) === isType_t;
  }
}

console.log(isType('array')([]));
```
优化：
```
function isType(type) {
  return function (params) {
    return Object.prototype.toString.call(params) === '[object ' + type + ']';
  }
}

console.log(isType('Array')([]));
```

练习2：
用 js 实现一个无限累加的函数 add 形式如下：
```
add(1)
add(1)(2)
add(1)(2)(3)
add(1)(2)(3)(4)
```
```
function add(a) {
  function sum(b) {
    a = a + b
    return sum
  }

  sum.toString = function () {
    return a
  }

  return sum
}


console.log(add(1)(2));
```

思考：
现有一个数组 arr = [[1,2,3],[4,5,6],[7,[8,9,[10]]]]
如何将数组扁平化

```
var arr = [[1, 2, 3], [4, 5, 6], [7, [8, 9, [10]]]]

console.log(arr.toString().split(',').map(Number));
console.log(arr.flat(Infinity));
```
两种方式 均能满足。如需更多， **[点击劫里噢~](https://es6.ruanyifeng.com/#docs/array)**
- - -

### 柯里化
什么是柯里化？
柯里化又叫部分求值，维基百科中对柯里化的定义是这样的：
**在数学和计算机科学中，柯里化是一种将使用多个参数的函数转换成一系列使用一个参数的函数，并且返回接受余下的参数而且返回结果的新函数的技术。**

通俗来讲就是只传递给函数一部分参数来调用它，让它返回一个新函数去处理剩下的参数。
如：
```
const add = (...args)=> args.reduce((a,b)=> a + b)

add(1,2) // 3

var sum = currying(add)
var ret = sum(1)
sum(2)
sum(3)
sum()
```
请实现上述代码中 currying 函数
```
function currying(add) {
  const m = []
  return function result(...args) {
    if (args.length === 0) {
      return add(...(m.flat(Infinity)))
    } else {
      m.push(args)
      return result
    }
  }
}

// 测试 ----------------------------------------------
const add = (...args) => args.reduce((a, b) => a + b)

// console.log(add(1, 2)); // 3

var sum = currying(add)
var ret1 = sum(1)  // 1
sum(2)(1)
sum(3, 4, 5)
console.log(sum());  // 3
```
上述代码其实很好理解 currying 函数 接受了一个函数 add 内部 使用闭包保存参数， 当传入参数的数量足够执行函数时，开始执行函数。
上面 currying 函数实现是一种简化的写法，判断传入的参数长度是否大于0 如果为 0 则执行 否则进行参数收集。

**另一种常见的应用是 bind 函数**，我们应该还记得 bind 的作用是返回一个可执行的函数，修改 this 指向我们的目标对象，我们来看一下 bind 的使用：
```
function sayName() {
  console.log(this.name);
}

var ob1 = {
  name: 'zhang san',
}

var ob2 = {
  name: 'li si'
}


sayName.call(ob1) // zhang san
var fun = sayName.bind(ob2)
fun()  // li si

```
首先我们看到 我们用两种方式来演示 一种是 call ，一种是 bind。首先如果不改变 sayName 中 this 的指向，this 会指向全局对象，全局对象中没有 name 属性，所以是 undefined
再看下面 ，使用 call 执行代码时，函数执行，但是 当我们使用 bind 的时候，没有直接执行，而是返回了一个可执行的函数，这其实就是一种柯里化。 bind 的模拟实现和柯里化函数的实现，其核心都是一致的。
```
Function.prototype.binds = function () {
  var target = Array.prototype.shift.call(arguments)
  var args = Array.prototype.slice.call(arguments)
  var self = this;

  return function (...params) {
    return self.apply(target, args.concat(params))
  }
}

function name(params) {
  console.log(this.name);
}

var ob1 = {
  name: 'zhang san'
}


var func = name.binds(ob1)
func()
```

















