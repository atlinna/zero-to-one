## 提升

我们习惯将 var a = 2; 看作一个声明，而实际上 JavaScript 引擎并不这么认为。它将 var a和 a = 2 当作两个单独的声明，第一个是编译阶段的任务，而第二个则是执行阶段的任务。

这意味着无论作用域中的声明出现在什么地方，都将在代码本身被执行前首先进行处理。
可以将这个过程形象地想象成所有的声明（变量和函数）都会被“移动”到各自作用域的
最顶端，这个过程被称为提升。

如下：
```
    "use strict"
    a = 2;
    console.log(a);
    var a;
```
上述代码会输出什么？
因为是严格模式，所以并不会在全局作用域声明同名变量，有的开发者会认为 Reference Error，但实际上输出 2

```
    console.log(a)
    var a = 2;
```
这个又输出什么呢？
应该是 *undefined*

大概的原理就是，编译器会将 声明和赋值 分开处理。
用 var a = 10; 举例
它会被拆分成 var a; a = 10; 然后 先进性 var a 也就是声明变量 a 此时 a 为 undefined，表示作用域中已经存在这个变量了，然后当读到前面的 var a = 10; 这行代码时，在进行剩下的赋值操作。

**先有声明，然后赋值**

只有声明本身会被提升，而赋值或其他运行逻辑会留在 原地 。如果提升改变了代码执行的顺序，会造成非常严重的破坏。

函数声明也会被提升
```
  foo()
  
  function foo(){
    console.log(1);
  }
```

但是请注意！！！ 函数表达式不会被提升！
```
  foo();
  var foo = function (){
    console.log(1)
  }
```
为什么呢？
我们 var 声明的变量的初始值是 undefined，函数声明的值是 function(){}
也就是说 当 foo 执行的时候 foo 为 undefined 我们对 undefined() 调用。 TypeError。他会告诉你 foo 不是 function

如果 var 声明 和 函数声明 声明的是同一个会发生什么？
```
console.log(foo);

var foo;
function foo() {
    console.log(2);
}
```
我们发现打印结果是 foo 函数，调换他们的位置,发现结果是相同的。
**函数声明和变量声明都会被提升。 函数会首先被提升，然后才是变量。**

在看下面
```
function foo() {
    console.log(2);
}

var foo;
console.log(foo);
```
如果只是在函数后声明了变量，但没有赋值，foo 还是函数。


