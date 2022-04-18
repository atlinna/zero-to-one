### ES6
**let 命令**
ES6 新增 let 命令用来声明变量。用法和 var 相同，但是**所声明的变量只在 let 所在的层级有效**
```
let a = 1;
function hello() {
    let b = 2;
    if (true) {
        let c = 3;
    }
}

console.log(a, b, c);
```
通过控制台发现，如果直接打印 a,b,c 会报错 b is not define ，他说 我们并没有声明 b 这个变量，那我们在 hello 这个层级中打印 b 发现可行，c 还是无法打印， 将 c 放到 hello 中，依旧报错。
那我们把 console 的位置放到 if 中，诶 可行，印证了 let 声明的变量只在 let 变量声明的当前层级中有效。

想一下如果 存在 A，B 两层级，B 含于 A，
```
let a = 1;
function hello() {
    let b = 2;
    console.log(a, b);
}
```
这样是否能打印出 a ？
肯定是 可以的对吧？  与层级穿透无关， 你的 b 层级本来就是存在于 a 层级中的 对吧？

我们再来看下面的代码
```
let arr = []
for (var i = 0; i < 10; i++) {
    arr[i] = function () {
        console.log(i);
    }
}

console.log(arr[6]());
```
如果我们使用 var 命令来声明变量 i 那么最后打印出的结果就是 10 为什么？
因为命令 var 会使变量 i 提升到全局，也就是顶层作用域，当我们 for 循环执行完毕之后 i 是 10 （i 从 0 ~ 9 有效，当加到 10 不满足 i < 10 的条件，停止 for 循环）对吧？
注意，这个时候我们顶层作用域中 i 是几 ？  是不是 10，当你运行 arr[6] 这个函数的时候，你的 i 是不是也是 10 ？ 不管你运行 arr 0 ~ 9 哪一个函数，它都是 10。

但是，如果我们的变量 i 使用 let 命令声明呢？
```
let arr = []
for (let i = 0; i < 10; i++) {
    arr[i] = function () {
        console.log(i);
    }
}

console.log(arr[6]());
```
结果是多少就打印多少。
为什么呢？
let 命令声明的变量会放到块级作用域中，你可以把这个想象成一个单独的盒子，
第一次我们声明了 i = 0，放到一个盒子中 然后呢我们的 arr[0] 这个函数，使用了这个盒子中的 i 这个盒子里面只有一个 i 就是 0
第二次我们声明了 i = 1，放到另一个盒子中 然后呢我们的 arr[1] 这个函数，使用了这个盒子中的 i 这个盒子只有一个 i 就是 1
·
·
·
直到最后 i = 10，此时我们的 for 循环已经停止了对吧，那我们的块级作用域中，是不是只存在自身的数？它取不到其他小盒子中的 i，那么我们此时再运行函数，i 是几就打印几。

for循环有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。
我们能在 for 循环内部取到 i ，对吧

let 不允许重复声明，且在声明之前无法使用。

**块级作用域**
为什么需要块级作用域？
+ **1、内层变量覆盖父级作用域变量**
  ```
  var temp = 'hello world'

  function modify() {
    console.log(temp);
    if (false) {
        var temp = 'hello jojo'
    }
  }
  modify()
  ```
  如上，本来我们 modify 这个函数中 false 里面的代码是无论如何都不会执行的，但是因为使用 var 命令声明变量，变量提升，将 temp 提升到 modify 函数作用域中，此时如果我们想在 if 外使用
  全局 temp 值，就是 undefined。
+ **2、循环变量泄漏到全局**
  ```
  var arr = []
  for (var i = 0; i < 10; i++) {
    arr[i] = function () {
        console.log(i);
    }
  }
  ```
  如上，i 会提升到全局作用域中，我们打印 i 只能打印出 i 最后的结果 10.
  我们希望的是，这个变量只控制循环，在循环体结束后，这个变量消失。
  
块级作用域还有一个最大的特点就是，**不能读取内层作用域内的变量，但是内层作用域可以定义与外层作用域内同名的变量。**

**块级作用域与函数声明**
函数能否在块级作用域中声明呢？
在 ES5 中，函数只能在全局作用域或函数作用域中进行声明，不得在块级作用域中声明。
```
    function hello() {
        if (false) {
            function testBlock() { console.log('this is a test'); }
        }
    }


    try {
        function testBlock() { console.log('this is a test'); }
    } catch (e) {
        console.log(e);
    }
```
上述代码中声明函数的方式都是不合法的。
但是哈，人家浏览器就想了，你们 JS 的规则关我屁事，如果遵守你的规则那我以前的小弟们怎么办。于是，为了兼容旧代码，浏览器并没有遵守这个规则，它支持你在块级作用域中声明函数，并不会报错。

ES6 引入了块级作用域这个概念，明确允许在块级作用域中声明函数。
ES6 规定，**块级作用域中，函数声明的行为类似于 let ，在块级作用域外 不可引用！！**

```
    function testBlock() {
        console.log('this is test global');
    }

    void function hello() {
        if (false) {
            function testBlock() { console.log('this is a hello'); }
        }
        testBlock()
    }()
```
上面代码如果在 ES5 中执行应该是打印 this is hello ，在 ES6 中执行应该是 this is test global，因为 ES5 中会将 testBlock 提升到作用域头部，如：
```
    function testBlock() {
        console.log('this is test global');
    }

    void function hello() {
        function testBlock() { console.log('this is a hello'); }
        if (false) {
        }
        testBlock()
    }()
```
但是，当我们真正执行这段代码的时候发现，竟然报错了

原来，如果改变了块级作用域内声明的函数的处理规则，显然会对老代码产生很大影响。为了减轻因此产生的不兼容问题，ES6 在附录 B里面规定，浏览器的实现可以不遵守上面的规定，有自己的行为方式。
+ 允许在块级作用域内声明函数
+ 函数声明类似于 var，意味着会提升到全局作用域或函数作用域头部，值为 undefined
+ 同时，函数声明还会提升到所在的块级作用域的头部。

也就是说我们之间执行的实际上是下面的这段代码：
```
    function testBlock() {
        console.log('this is test global');
    }

    void function hello() {
        var testBlock = undefined
        if (false) {
            function testBlock() { console.log('this is a hello'); }
        }
        testBlock() // testBlock is not a function
    }()
```

那么综合以上情况，我们要考虑下是否要在块级作用域下声明函数了，也不是说不能声明。但是如果使用的话，还是使用函数表达式的方式。
```
    if(false){
        let testBlock = function (){console.log('this is test block')}
    }
```
另外，ES6的块级作用域允许声明函数的规则，只在使用花括号({})的形式下存在，否则会报错。

应用：

```
let arrayLike = {
    0: "hello",
    1: " - ",
    2: "world",
    length: 4,
};
let arr = [1, 2, 3, 4, 5]
let r = [].copyWithin.apply(arrayLike, [1, 2, 3])
console.log(r)
```

```
let arr = [1, 2, 23, NaN, 5];
let obj = {
    name: "xiaoming",
    age: 18,
};
let flag = arr.findIndex(function (item) {
    console.log(this);
    return Object.is(NaN, item)
}, obj);
console.log(flag);
```

```
let arr = [1, 2, 23, NaN, 5];
let obj = {
    name: "xiaoming",
    age: 18,
};
let flag = arr.findIndex(function (item) {
    return Object.is(NaN, item)
}, obj);
console.log(arr.entries());
for (let [k, v] of arr.entries()) {
    console.log('key:', k, '--', 'value:', v)
}
console.log(arr.includes(2))
```

```
let obj = {
    name: "xiaoming",
    age: 14,
    hobbies: ["basketball", "football", "pinpang"],
    handler() {
        console.log("hello world");
    },
};
```

