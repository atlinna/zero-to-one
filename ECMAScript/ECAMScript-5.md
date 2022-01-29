# ECAMScript-5 
## This toturial will teach you javascript from basic to advanced 
## come on,let's go get start it!

** First! Learn to use documents **
https://www.w3schools.com/js/js_whereto.asp

### some knowledges
```
  javascript and java are completely different languages,
  both in concept and design.JavaScript was invented by Brendan Eich in 1995,
  and became an ECMA standard in 1997.
```
---
### 堆、栈、值
javascript和C/C++不同，没有区分堆内存和栈内存。而且我们的浏览器也有垃圾回收机制 这个可能会造成很多前端开发者不会太重视js的空间结构。 这是不对的
如果想要更底层的去了解js （深浅拷贝的区别、闭包、原型及原型链）就要对js空间结构有个基本的认知。

**我们可以认为：在js中所有的数据都是放在堆内存当中的。**
|| 堆内存：key:value 形式的键值对
我们可以把堆当作一本树。当我们翻开书的时候首先看到的是什么？
是书的目录。目录通常带的是页码、内容 可以根据目录中的页码找到相应的内容，key 就相当于是页数 value 相当于我们书中的内容。我们可以根据自身的需求
或喜好随意的查找需要的value，因为 堆是无序的。

|| 栈内存：
我们通过薯片盒子来了解栈的特点
那种罐装一端开口的薯片 叫啥忘了（没吃过的建议水滴筹买一罐，可比克还是啥的）
工人把薯片一片片装进去，然后！正常情况下 他装的第一片我们是不是要最后才能吃到。
当我们把薯片罐 换成栈 薯片就是即将进入栈内的数据，我们最先入栈的数据最后才能出来。


|| 队列：
队列和栈又是不同的，我们最先入栈的数据是最后才能拿出来的 但是队列是最先进入队列的最先出来。
好比火车站出站的时候要排队检票，这个时候你排的位置越靠前越先出来。

---

### js垃圾回收机制
javascript中的内存管理是自动执行，不可见的。
我们创建基本类型、对象、函数都需要**内存**。
**可达性**
在js的垃圾回收机制中 可达性是主要的概念。
可达性的数据就是指那些以某种方式可访问或可用的值，他们被保证存储在内存中。
假设我们现在有这样一个数据
```
 var obj = {
    name:'zhangsan',
    age:18
 }
```
我们声明了一个变量obj，然后呢让obj引用了对象{name:'zhangsan',age:18} 这个时候 obj 存储的是对象的地址。
当我们 将 obj = null 清掉了obj对该对象的引用，这个时候 对象还是存在的对吧？ obj也是存在的，只不过obj失去
了对{name:'zhangsan',age:18}的引用。 这个时候对象变成不可达的数据 将会被垃圾处理机制回收。

然后我们又假设在声明obj的同时声明了另外一个变量 abs ,我们让abs = obj,这个时候 obj这个变量保存的是对象的地址，
同时 abs保存的也是对象的地址。 abs、obj都指向对象{name:'zhangsan',age:18}，这个时候我们让obj = null obj失去了
对象的引用 那这个时候 对象会被垃圾清除机制清理掉吗？ 答案是不会的，因为abs还保留着对 该对象的引用 并非是不可达的。
```
 var obj = {
    name:'zhangsan',
    age:18
 }
 
 var abs = obj
```

**有一组值无法被清除**
+ 本地函数的变量和参数
+ 全局变量
+ 调用链上其他函数的变量和参数
**这些被称为根（roots）**

### 标记清除 - 算法机制
垃圾处理的算法机制是标记清除（mark-and-sweep），他定期的执行。
+ 首先垃圾处理器会标记所有的根
+ 然后会访问和标记所有来自根的引用
+ 访问所标记的对象并继续标记他们的引用，所有访问过的对象都会被标记，防止重复访问。
+ 依次反复的访问和标记所有可达引用 
+ 所有没有被标记的对象将被清除回收。

js引擎通过优化使其运行的更快，不会影响正常代码的执行：
+ 分代回收：将对象分为“新对象”与“旧对象”。对新对象来讲，他会经常的被检测然后被清除。新对象经过多次的检测后会变为老对象，检测的次数会变少
+ 增量回收：一次性访问和标记整个对象显得很呆。因此，js引擎会试图将垃圾回收分解为多个部分，然后逐个击破。这需要额外的标记支持但是会响应的减小延迟。
+ 空闲时间回收：只在CPU空闲时运行，最大限度的减小对正常执行的影响。

### 引用计数
引用计数就是会跟踪并记录每个值的引用次数，值被引用，引用次数加一，反之减一，当引用次数为0时会被清除。
但是这个方式有一个缺陷就是无法处理重复引用的问题。造成内存泄漏。
```
  function handler(){
    var obj1 = {};
    var obj2 = {};
    obj1.value = obj2;
    obj2.value = obj1;
  }
```
当handler函数执行的时候 obj1 和 obj2 会重复的引用 这就造成他们的引用次数不会为0，这个时候只能手动释放引用。

### 可能会造成内存泄漏的情况：
+ 全局变量 - 全局变量运行时不会被回收，因此需要及时手动去清理，比如运用规范校验或者严格模式。
+ 闭包 - 闭包可以创建缓存值，不释放资源。
+ DOM 对象引用 - 如果某个DOM元素，在js中存在他的引用，他的生命周期时由js和是否在DOM树上两者决定的。
+ 定时器和回调 - 及时清理 setTimeout 和 setInterval 。


---

### javascript 全局执行上下文
javascript 的运行环境大概可以分为：
+ 全局环境
+ 函数环境
+ eval

eval 是一个可执行的函数 这个函数可以将字符串转为一段可执行的代码 比如
```
 eval('console.log(1)')
 //这个时候控制台可以打印出 1 
 
```
但是 eval 这个 不推荐使用 可以用在开发或测试环境来进行调试。

我们将用下面的一段代码来理解执行上下文。
```
  var name = 'Alex';
  function handleCreatePerson(pname,age){
    var person = {'name':pname || name,'age':18};
    
    function handleGo(){
      console.log('go and see!')
    }
     handleGo()
    function handleSay(){
      var str ='my name is ' + person.name + "and I'm " + person.age + 'years old';
      console.log(str);
    }
    handleSay()
  }
 
 handleCreatePerson('Ann',19);
```
js引擎会以栈的方式来处理上下文，栈底永远是全局上下文  下面来解读上面的代码：
```
// 由于不同环境全局表示不同，这里我们使用global 来指代全局作用域,event_stack表示事件调用栈。
const global = window;
const event_stack = []
// 栈底是全局作用域，或者换个方向想，全局作用域在浏览器打开就存在
// 所以首先 将全局上下文 入栈
event_stack.push(global) // 栈内 ['global']
// 入栈后开始解析读取代码 直到遇到 handleCreatePerson() 这个时候函数执行一定会创建属于他自己的上下文。
// 于是 handleCreatePerson 入栈 开始解析 函数handleCreatePerson的代码 js是单线程 所以不会在handleCreatePerson后继续进行直到handleCreatePerson代码执行完成。
event_stack.push(handleCreatePerson) // 栈内 ['global','handleCreatePerson']
// 就这么走走走 诶  遇到了 handleCreatePeron 的内部函数 handleGo 于是 handleGo入栈
event_stack.push(handleGo) // 栈内 ['global','handleCreatePerson','handleGo']
// 当我们遇到handleSay 之前 这个handleGo函数是不是已经执行完毕了？ 所以 他的上下文已经没有用了 要出栈 于是。
event_stack.pop()   // 栈内 ['global','handleCreatePerson']
// 然后 遇到handleSay
event_stack.push(handleSay) // 栈内 ['global','handleCreatePerson','handleSay']
event_stack.pop()   // 栈内 ['global','handleCreatePerson']
// 这个时候 handleCreatePerson 也执行完毕
event_stack.pop()   // 栈内 ['global']
// 然后继续往下解析代码 最后发现 诶没有了 好代码解析结束  但是我们的全局上下文是不出栈的 只有当窗口关闭 才会释放。
```

---

### 变量对象和活动对象
+ 变量对象：Variable Object。
+ 活动对象：Activation Object。

变量对象和活动对象是什么呢？
**变量对象：**是执行上下文创建阶段创建的对象。
**活动对象：**是函数执行上下文执行阶段创建的对象。
这两个对象有什么作用呢？下面这段代码执行的过程又是怎样的呢？
```
function foo(){
  console.log(a);
  var a = 1;
  function boo(){
    var b = 2;
  }
}
foo();
```
```
这里要引出另外一概念叫做 “变量提升”.什么又是变量提升呢？
首先js引擎编译代码时会先看一遍整体 什么意思呢 就是会给代码设置一个初始的状态 ，会将以 function 关键字声明的函数 和 var关键字声明的变量 提到最前面然后呢 function 的
初始 就是 function (){}  变量呢 就是 undefined。
以 函数 foo 为例 在全局执行上下文创建阶段 发现了 function 的 函数 foo 然后 把他 当成 function foo(){} 一个函数放在最前面。 这个时候可能有人有疑问了 这个foo本来就在前面啊，如果放在
foo();的后面呢。
--------------------------------------------------------------------------------------------------
foo();

function foo(){
  console.log(a);
  var a = 1;
  function boo(x){
    var b = 2;
  }
}
----------------------------------------------------------------------------------------------------
其实结果是一样的，foo 会提升到最前面 被声明成 function foo(){} 
这个时候就创建出了 全局执行上下文的 VO （变量对象），结构如下 ，创建的过程就是

VO = {
  arguments:{//...},
}

1、首先查看执行上下文是否存在 var 声明的变量。 没有，好 下一步
2、找到 function 关键字声明的函数 及 他的 参数列表，然后会以函数名为key
VO = {
  // arguments:{}, //因为函数中没有参数 所以去掉。
  foo:reference to function foo(){}
}
3、继续解析代码直到 函数执行。

由于foo的调用 foo的执行上下文开始创建
然后就会发现一个问题 foo函数内第一行直接打印出 a 但是这个时候 a 还没有被声明 有人就会问了 这不会报错吗？
带着这个疑惑 我们继续往下走
首先 老规矩 var 关键字 function 关键字 找到了 a 和 boo对吧
然后这个时候 想一下 变量提升 是提升到最前面
也就是说 foo 变成了 这个样子
function foo(){
  var a = undefined;
  function boo(x){};
  console.log(a)
}
这个时候 a 是什么  undefined 对吧  并不会报错。
根据这个foo 我们创建他的VO  由于boo是带有参数的所以
VO={
  arguments:{x:undefined},
  boo:referebce to function boo(){},
  a:undefined,
}
-----------------------------------------------------------------------------------------------------
我们在这个时候 已经完成了foo执行上下文的创建 然后干什么？
开始执行 foo 这个函数！
这个时候变量对象会被激活 首先会通过 arguments 对象初始化为活动对象 AO
然后 开始逐行解析代码 对 AO对象进行赋值

AO={
  arguments:{x:undefined,callee:foo,length:1},
  boo:referebce to function boo(){},
  a:1,
}

然后函数执行完毕 foo 执行上下文出栈。
```

---
### 基本数据类型
+ String
+ Number
+ Boolean
+ Symbol
+ Null
+ Undefined
+ BigInt    for google only

### 引用类型
+ Object
 - Function
 - Array
 - Date
 - RegExp

你可以使用typeof 来查看我们的数据类型(基本类型)，
但是你会发现 当你使用typeof 来检查null的时候 返回的是object
具体原因是：
```
  因为不同的对象在底层都表示为二进制，在javascript中二进制前三位为0的话都会被判断为object类型，
  null的二进制表示为全0，所以他的前三位肯定是0，因此 当你使用typeof来检查null的类型返回的是object。
```
如果使用typeof 来检查引用类型
举个栗子：
```
typeof Array  //function
typeof Array()  //object
typeof new Array() //object

typeof Boolean //function
typeof Boolean() // boolean
typeof new Boolean() // object
```
我们可以看到 typeof 不止能检查出基本数据的类型 ，还能检测出function 类型，也就是说
我们的js 内置构造函数 如Array，Number等 都是function，函数也属于对象。
而我们使用new关键字创建的实例是 一个对象Object。

typeof的安全防护机制
```
首先要知道undefined(未定义)和undeclared（未声明）
undefined 和 undeclared 表现相同都为undefined。
假设我们要引入一个js 但是这个js我们只想在开发环境或者测试环境中引入，这个js中有个全局开关Flag 当Flag=true时 我们认为他引入
如果直接使用if判断Flag的话 会报错。
if(Flag){//···}
因为根本没有生命这个变量
所以 我们可以使用一种安全的方式
我们可以确定 typeof Flag 存在的话 是boolean 不存在的话 或者说没有声明的话 是undefined
if(typeof Flag !== 'undefined' ){//···}
```
注意：
+ js是单线程
+ 代码同步执行，只有栈顶的上下文执行，其他的需要等待。
+ 全局上下文只有一个，当浏览器关闭时出栈。
+ 函数的执行上下文没有限制，理论上可以无限增加。

---
### 类型转换
js 可以通过一些内置的构造函数或方法来将一种类型转换成另外一种类型，如 字符串 转换成 数字
```
 有构造函数Number、String、Boolean、Symbol 构造函数 分别能将数据转为 数字、字符串、布尔值、标记值。
 
 let a = 12;        //  12
 let b = String(a); // '12'
 
 像这种你能够清楚的知道要转换的类型是什么的行为吧 成为显式类型转换。
 
 你知道上面的结果 那你知道下面的结果吗？
 let a = '12';
 let b = 3;
 let c = 8;
 let ret;
 
 ret = a + b;      // '123'
 ret = a - c;      // 4
 ret = c + a;      // '812'
 ret = a * b;      // 36
 ret = a + b * c;  // '1224'
 ret = a / b;      // 3
 
 看看你答对了多少？
 
 为什么会这样？
 因为在计算时由于等号两边的数据类型不同 导致cpu无法进行计算，js的编译器会自动将运算符两边的数据转换为同一类型。
 
 规则是怎样的呢？
 
 1、String字符串转换：如字符串 + 变量 = 字符串；
 如 '12' + 3 = '123';
    '' + 4 = '4';
    
 2、Number数字类型：使用算术运算符 或 关系运算符
    '12' - 3 = 9;
    '12' - '3' = 9;
    
 3、Boolean布尔转换： ！变量
    !!'12' = true;
    
 4、undefined == null 但是 undefeied !== null
 
 5、NaN 不等于任何数 包括他自身
 
 6、true = 1， false = 0
 
 7、引用类型不要使用 == 判断 因为保存的是引用地址。
 
 8、'12' + 3 如何等于 15
    +'12' + 3 = 15
    9 + +'12' = ? // 21
 
```
### == 的作用
我们知道 1 != 2; true == true;
那是否知道 [] == ![]的结果呢？ 答案是true
很神奇是吧，如果你对 == 有了一定理解之后这个就很简单啦。

首先我们来看看 == 是怎么工作的。这里会涉及强制类型转换（隐式）。
+ 1、如果有一个数据是布尔值，则在比较相等性前会将他转换成数值 即 false -- 0   true -- 1.
+ 2、如果有一个数据是字符串，另一个值是数字，在比较相等性前会先将字符串转为数字。 '' -- 0
+ 3、如果一个数据是对象，另一个不是，则会调用对象的valueOf方法，如果拿到的值不是基本类型，则会根据valueOf的返回值继续调用toString方法 （这是为什么会出现"[object object]"的原因）
+ 4、如果两个数据都是对象，则比较他们是否为同一对象。如果是 返回true 否则为 false
这两个数据在比较时要遵循以下规则
+ null 和 undefined 是相等的
+ 在比较相等性前，不能把null 和 undefined 转换成其他值
+ 如果一个数是NaN 则相等操作符会返回false ，不等操作符返回true，且NaN != NaN

这样我们就可以发现上面的例子中 ![] 将数据转换为Boolean 也就是 !Boolean([]) -- !true --> false
然后呢 等式就变成了 [] == false --> [] == 0 根据第一条和第三条来看 首先 []是对象 会调用valueOf 得到[] 不是基本类型 继续调用同String（）方法 [].valueOf().toString()，得到空字符串
"" == 0 然后再根据第二条 Number("") == 0 --> 0 == 0 --> true

这个我们会了 再来个 [undefined] == false.
你会发现，当我们熟悉这个规则之后是very的easy，very的简单。

---

### Scope 作用域
我的理解 作用域类似于一个集合，这个集合显示出的是我们函数或者变量能够访问到的值。
打个比方说 如果有一个变量a在全局作用域中创建 然后 有一个变量b 在函数foo中创建，然后我们把a的值赋给b,然后我们在foo函数外打印出b，此时会发生什么？
```
var a = 1
function foo(){
  var b = a;
}
console.log(b)
```
会报错 b is not defined 对吧 为什么呢？
我们来看一下这个流程 在全局作用域中 我们能访问到的是不是 { a, foo } 这个
然后呢 我们再看看 foo 的作用域 { b } 但是 我们的 foo 函数是处于全局作用域下的 所以 他能访问到的作用域 是 [{b},{a,foo}] 这两个
当我们给 b 赋值 a 时 由于 a 在我们能找到的范围中。 但是 当我们想要在函数外打印出 b 的时候我们发现 b 只能在foo中才能找到，可是
我们打印实在foo函数外面 所以找不到变量 b 于是就报错了。
**而 foo 访问的作用域 称为作用域链 ScopeChain:[VO(foo),VO(global)].**
可能会有人认为 我们的 foo 的作用域是含于 全局作用域的，这样是错误的。
你可以认为形成了一条单向的通道供我们来访问外部的作用域，事实上 是会按照 VO 这个变量对象创建的顺序来访问的 也就是按照作用域链的顺序
如 在foo函数中 我们给变量b赋值为a 作用域链是[{b},{a,foo}]
这个时候首先查找了自己的作用域 发现没有 a 于是会继续向上查找 发现 诶全局作用域是有的，然后就拿过来用了。


### 闭包 
**[可参考此文章](https://github.com/yygmind/blog/issues/17)**  
闭包是面试时候面试官最喜欢问的面试题之一吧，听说闭包是能将个二十分钟到半个小时的，我们一起来研究一下。争取咱也来个半小时。
闭包是一种特殊的对象。
由两个部分组成，一个是函数创建的执行上下文 代号 Alpa 及 在这个执行上下文中创建的函数 代号Beta。
当Beta这个函数执行并开始访问Alpa中的变量对象的值时，就会发生闭包。 如下：
我们定义了一个函数foo 并 创建了 a，b 两个变量并赋值，然后在foo 函数内 又定义了一个函数 boo 最后通过 foo 把 boo 函数返回出来。
```
  function foo(){
    var a = 10;
    var b = 20;
    
    function boo(){
      a ++;
      b ++;
      return a + b; 
    }
    return boo;
  }
 var sn1 =  foo()
 sn1();
```
我们来分析一下这个函数
在全局作用域中 作用域是 { foo,sn1 }
在foo作用域中 作用域是 { a,b,boo } 作用域链 [{a,b,boo},{foo,sn1}]
在boo作用域中 因为没有定义新的函数或变量 所以自身的作用域为 { } 但是 boo 是在foo作用域下创建的 自然能够访问到 foo 的作用域 于是 作用域链 [{a,b,boo},{foo,sn1}]
虽然 foo 这个函数执行会得到 function boo(){a++;b++;return a+b} 这个函数 但是我们的作用域链中是可以访问到 a 和 b 的值的 所以并不会出现爆红的现象。
如果我们执行boo 就会访问到foo 的内部变量 a,b 这个时候就会产生闭包。
也就是说当 foo 执行完毕 且已经向外部返回了函数 boo 之后 他的执行上下文确实已经出栈销毁，但是他的激活对象AO并没有销毁，因为boo还保存着对foo内部变量的引用，所以foo
的AO 会一直存在内存中。
```
var func = null

function handler() {
    var a = 0;

    function counter() {
        return a++;
    }

    func = counter
}

handler();
console.log(func()); //0
console.log(func()); //1
console.log(func()); //2
```
我们也可以通过闭包来保存我们之前的状态
如上面这个计数器 虽然 counter 被保存在全局变量func中，但是实际上 counter的作用域还是指向 函数 handler 的 我们只是将 counter 的访问地址付给了全局变量func

**闭包的应用：**
+ 函数柯里化 形如  foo()()
+ 模块

有一个很简单很常见的例子 就是说 如何 让 下面的执行结果是按顺序的
```
for (var i = 0; i < 5; i++) {
        setTimeout(()=>{
            console.log(i);
        },1000)
}
```
我们可以发现 当你运行这段代码的时候 执行结果是 5 全都是 5。
```
//1、可以将 var 改为 let 这样块级作用域就不会出现这种问题
for (let i = 0; i < 5; i++) {
        setTimeout(()=>{
            console.log(i);
        },1000)
}

//2、可以使用立即执行函数，我们可以将 i 作为参数传入到立即执行函数中 此时
for (var i = 0; i < 5; i++) {
    (function (s) {
        setTimeout(()=>{
            console.log(s);
        },1000)
    })(i)
}
```
**切记闭包不是真的只让你回答现象，包括了闭包的产生，作用域，作用域链，执行上下文，VO，AO**

《javascript高级编程》中有句话是这么说的：由于闭包会携带包含它的函数的作用域，因此会比其他函数占用更多的资源，过度使用闭包，会导致内存占用过多，造成内存泄漏。

所以要及时的将不用的空间释放。

---

### this 绑定
+ 默认情况（严格模式/非严格模式）
+ 隐式绑定
+ 显式绑定
+ new关键字绑定
+ 箭头函数（ES6）

#### 默认情况
**非严格模式：** 在非严格模式下 this 默认指向全局对象
**严格模式：** 严格模式下，this 会指向 undefined。在严格模式下嗲用函数不会影响默认绑定。
如下 1：a 默认为全局变量 运行test函数 此时能够打印出结果1 this 默认情况下指向全局对象
如下 2：当我们将此函数运行在严格模式时，此时会发现爆红，a is not defined，因为严格模式下不能使用默认情况，此时的 this 指向的是 undefined。
```
// 1
a = 1
function test() {
    console.log(this.a);
}

test()

// 2
'use strict';
a = 1
function test(){
    console.log(this.a);
}
test()
```
### 隐式绑定
当函数的引用有**上下文对象**，隐式绑定规则会把函数中的this绑定到这个上下文对象。
如下： 当我们想要使用对象中的name属性时
```
var user = {
    name: 'lilei',
    sayHi: sayHi
}

function sayHi() {
    console.log('hello, my name is' + this.name);
}

user.sayHi();
```
但是这样的绑定是不牢固的，在某些特定情况下可能会丢失this的绑定
这种情况叫做**隐式丢失**
被隐式绑定的函数，如果将引用传递给一个新的变量，那么此时就相当于直接调用函数本身，this 指向 全局对象或 undefined
```
var user = {
    name: 'lilei',
    sayHi: sayHi
}

name = 'hanmeimei'

function sayHi() {
    console.log('hello, my name is ' + this.name || '空');
}

var handler = user.sayHi;
handler()
```
如下：同上面的情况相同，本质都是直接引用了函数本身，但是通过回调函数传递的方式，实质上相当于变量赋值。
```
var user = {
    name: 'lilei',
    sayHi: sayHi
}

name = 'hanmeimei'

function sayHi() {
    console.log('hello, my name is ' + this.name || '空');
}


function main(func) {
    func()
}

main(user.sayHi)
```
**显式绑定**：
javascript中可以通过call，apply方法来改变 this 的指向。
call(target,...rest) 第一个参数是我们要指向的目标 ，然后是我们 函数需要接受的参数
如下 我们定义了一个对象 user 合一个方法 sayName 来输出 对象 user 的名称信息
然后通过 call 方法来改变 this 的指向让其指向 user
```
var user = {
    name: 'zhangsan'
}

function sayName(age, hobbies) {
    console.log('hello my name is ' + this.name + ' ' + age + ' ' + hobbies.reduce((prev, item) => prev + ',' + item), '');
}
// hello my name is zhangsan 10 football,basketball,swimming 

sayName.call(user, 10, ['football', 'basketball', 'swimming'])
```
apply(target,[...rest]) apply方法和call的功能类似，但是apply如果想要给函数传递参数的话，需要以数组的形式传参
如下：
```
var user = {
    name: 'zhangsan'
}

function sayName(age, hobbies) {
    console.log('hello my name is ' + this.name + ' ' + age + ' ' + hobbies.reduce((prev, item) => prev + ',' + item), '');
}

sayName.apply(user, [10, ['football', 'basketball', 'swimming']])
```
在隐式绑定的时候会出现丢失this指向的情况。如果我们更换了显示绑定也就是 call、apply还会不会出现呢？

**bind**
bind(target)
ES5中内置了 Function.prototype.bind bing会返回一个绑定了target的函数
```
var user = {
    name: 'zhangsan'
}

var user1 = {
    name: 'linken'
}

function sayName(age, hobbies) {
    console.log('hello my name is ' + this.name + ' ' + age + ' ' + hobbies.reduce((prev, item) => prev + ',' + item), '');
}

sayName.apply(user, [10, ['football', 'basketball', 'swimming']])
sayName.bind(user1)(20, [1, 2, 3])
```

### native code
我们可以尝试着去实现一下 bind 
首先我们可以看一下 bind 的特征
+ bind可以被我们的函数调用 说明 在Function原型中
+ 调用bind 需要传入一个参数target
+ 返回一个已经绑定了target的函数
+ 这个返回的函数可以继续传入参数来调用
```
Function.prototype.myBind = function (target) {
    var _this = this
    return function () {
        _this.call(target, ...arguments)
        // 或是 _this.apply(target,arguments)
    }
}

var user = {
    name: 'zhangsan'
}

function hello(...rest) {
    console.log(this, rest);
}

var handler = hello.myBind(user)
handler(1, 2, 3, 4, 5)
```
一些内置的api也是有能够改变this指向的参数的 比如：下列代码，这个参数的功能和call 与 apply是
```
var user = {
    name: 'zhangsan'
}
var arr = [1, 2, 3, 4, 5]
arr.forEach(function () {
    console.log(this);
}, user)
```
**new关键字来绑定**
情人节的时候，我们都听过一个梗叫做 new 一个对象出来 那个被 new 的东西叫做构造函数 但是。
+ js中 ，构造函数只是使用 new 操作符时被调用的 普通函数 （意思就是谁来都一样，只不过后来规定了构造函数需要首字母大写），他们不属于类，也不会实例化类（js是没有类这个概念的，虽然ES6定义了class）
+ js中内置对象函数也是可以用 new 来调用的 这种称为构造函数调用。
+ 并没有构造函数这个东西，只有**构造调用**。

使用 new 来调用函数，会进行一些操作：
+ 创建一个新对象。
+ 将新对象的原型指向构造函数
+ 将新对象绑定为构造函数的this
+ 如果构造函数返回了其他对象则 不变 否则 返回新对象！

根据上面的步骤我们来模拟一下 new 关键字
```
function myNew(constructor, ...rest) {
    let obj = {};
    obj.__proto__ = constructor.prototype;
    let ret = constructor.apply(obj, rest);
    return ret instanceof Object ? ret : obj
}

function Person(name, age) {
    this.name = name;
    this.age = age;
}

p = myNew(Person, '张三', 18);
console.log(p);
let obj = myNew(Object)
console.log(obj);
```
测试正常！
**代码解析**
首先创建一个新对象，然后将新对象的原型指向了构造函数，这样我们的对象就能够访问构造函数中的属性，然后 通过 apply 将 对象绑定到了构造函数中 也就是说 对象和构造函数真正的关联起来
此时 构造函数中的 this 指向了 对象 ，也就相当于 obj['name'] = name;obj['age'] = age; 然后对外返回这个对象或者是构造函数中的对象。

如果 显示改变this指向时传入的是 null 那么默认绑定规则会把this绑定到全局对象中。

更安全的做法是 传入一个空对象，把this绑定到这个对象不会有任何副作用。
JS中创建一个空对象的方式是Object.create(null) 他会创建一个空对象，但是不会创建Object.prototype 所以 比直接赋值为{}更空 更安全。

**间接引用：**
```
function test() {
    var a = 1;
    var b = { a: 2, foo: foo };
    var c = { a: 3 };


    console.log(b.foo()); // 2

    var s = (c.foo = b.foo)()
    console.log(s);
}

function foo() {
    console.log(this);
    return this.a
}

a = 10

test()
```
(c.foo = b.foo)() 相当于直接执行foo函数 this 指向全局对象。
```
Function.prototype.myBindTwo = function (obj) {
    var _this = this
    var arr = [].slice.call(arguments, 1)
    var bind_fun = function () {
        return _this.apply((!this || this === (window || global)) ? obj : this, arr.concat.apply(arr, arguments))
    }
    bind_fun.prototype = Object.create(_this.prototype)
    return bind_fun;
}
---------
function foo() {
    console.log("name:" + this.name);
}

var obj = { name: "obj" },
    obj2 = { name: "obj2" },
    obj3 = { name: "obj3" };

// 默认绑定，应用软绑定，软绑定把this绑定到默认对象obj
var fooOBJ = foo.softBind( obj );
fooOBJ(); // name: obj 

// 隐式绑定规则
obj2.foo = foo.softBind( obj );
obj2.foo(); // name: obj2 <---- 看！！！

// 显式绑定规则
fooOBJ.call( obj3 ); // name: obj3 <---- 看！！！

// 绑定丢失，应用软绑定
setTimeout( obj2.foo, 10 ); // name: obj
```
**箭头函数**  
ES6新增箭头函数，箭头函数与上面的规则完全不适用，它是靠外层作用域来决定this的指向。
如下：我们声明了两个函数 sayHi 和 sayHello  
sayHi 返回了一个箭头函数， sayHello 返回的是普通的function
然后都通过 call 来改变 this 让其指向 user
结果发现 handler2 执行后的结果是 global 而 handler1执行的结果是 zhangsan
这是因为 箭头函数的this 是根据 外层的this指向来判断的
我们通过call 改变了this 让其指向了 user 这个时候 箭头函数的外层就是 user 所以箭头函数指向 user
```
function sayHi() {
    return () => this.name
}

function sayHello() {
    return function () {
        return this.name
    }
}

const user = {
    name: 'zhang san'
}

name = 'golbal change'

handler1 = sayHi.call(user)
handler2 = sayHello.call(user)

console.log(handler1()); // zhang san
console.log(handler2()); // global change
```
但是在之前我们没有箭头函数的时候是如何解决这种问题的呢?
通过变量来保存上层函数的 this 
如下：
代码相似 只不过我们在sayHello函数中声明了一个变量 _this 来保存 sayHello中的this 这样我们的返回函数中使用这个变量就可以啦！
```
function sayHi() {
    return () => this.name
}

function sayHello() {
    var _this = this;
    return function () {
        return _this.name
    }
}

const user = {
    name: 'zhang san'
}

name = 'golbal change'

handler1 = sayHi.call(user)
handler2 = sayHello.call(user)

console.log(handler1()); // zhang san
console.log(handler2()); // global change

```
**思考：**  
有这样两个函数 sayHi 和 sayHello 内部代码完全一致 现在思考 两个函数的执行结果是什么？以及他们引用的内部变量是否会被垃圾回收机制清理。
```
name = 'global'
function sayHi() {
    const user = {
        name: 'zhang san'
    }
    function f() {
        return this.name
    }
    return f.bind(user)
}

function sayHello() {
    const user = {
        name: 'zhang san'
    }
    function f() {
        return this.name
    }
    return f.bind(user)
}


console.log(sayHi()());
handler = sayHello()
console.log(handler());
```
首先 我们能看出他们的执行结果都是 ‘zhang san’ 只不过 sayHi 函数柯里化直接执行 sayHello 是通过一个变量接受返回的函数然后运行。
然后呢 我们来分析 是否会被垃圾回收机制进行回收
现在主流浏览器使用的都是标记清除算法，都是从根节点开始遍历 看节点的可达性 我们来看第一个函数 通过一系列的操作返回了一个可执行函数
然后函数柯里化 执行完毕之后 我们发现并没有保留任何的引用也就是说 在这个地方我们的引用链断开了 这是不可达的 那么运行完毕后一段时间会被清除，
而我们再来看sayHello 先是通过变量handler 保存了 这个函数的引用，然后再执行 也就是说 我们通过这个 handler 就能够找到 返回的函数
可达的 会被标记 不会被清除，如果想要清除 只需要再执行完毕后 释放这个指针。 handler = null 这样 我们手动断开了 对这个函数的引用
将他变为不可达。

**思考：**  
console.log 依次输出的结果是什么呢？
```
var num = 1;
var myObject = {
    num: 2,
    add: function () {
        this.num = 3;
        (function () {
            console.log(this.num); 
            this.num = 4;
        })();
        console.log(this.num);
    },
    sub: function () {
        console.log(this.num)
    }
}
myObject.add();
console.log(myObject.num);
console.log(num);
var sub = myObject.sub;
sub();
```
我们来看执行过程 因为add函数中执行是含有上下文的 所以 add 中 this 指向的是 myObject this.num = 3 所以 myObject中的num = 3 然后 立即执行函数 this 指向全局对象  this.num = 4 ，
也就是头顶那个num = 4 但是 num 是再赋值前打印。 继续往下 声明了一个变量 sub 来接收 sub函数 隐式绑定丢失 this 指向 this 指向全局
ok 那么 按顺序看下来就是 1 3 3 4 4

**call 和 apply的应用**
call 和 apply 都能用来改变 this 的指向 ，唯一的不同点就是 call 是接受多个参数列表 而 apply 是接受多个参数列表组成的数组。 
下面我们一起来看下 call 和 apply的应用
- 合并两个数组
```
arr1 = [1, 2, 3]
arr2 = [4, 5, 6]
Array.prototype.push.apply(arr1, arr2)
console.log(arr1) // [1,2,3,4,5,6]
```
```
// 将数组分为 n 个 一组的数组
function cut(arr = [], n = 3) {
    if (n < 1) {
        throw new Error('请输入整数的分组')
    }
    if (arr.length == 0) {
        return []
    }
    let ret = [];
    let len = Math.ceil(arr.length / n)
    for (let i = 0; i < len; i++) {
        Array.prototype.push.call(ret, arr.slice(i * n, i * n + n))
    }
    return ret
}
```
- 获取数组中的最大值与最小值
Math.max() 返回参数列表中的最大值
Math.min() 返回参数列表中的最小值
```
Math.max.apply(Math,[1,2,3,4])
Math.min.apply(Math,[1,2,3,4])
```
- 判断是否为数组
可以通过toString() 来获取每个对象的类型，但是不同对象的 toString()有不同的实现，所以通过 Object.prototype.toString() 来检测，
需要以 call() / apply() 的形式来调用，传递要检查的对象作为第一个参数。
```
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
}

console.log(isArray([1, 2, 3])) // true
console.log(isArray([])) // true
console.log(isArray({})) // false

var dataToStr = Function.prototype.call.bind(Object.prototype.toString)
function isArray2(obj) {
    return dataToStr(obj) === '[object Array]'
}

console.log(isArray2([1, 2, 3]))
console.log(isArray2([]))
console.log(isArray2({}))
```
**类数组：**
什么是类数组？ 类数组就是一个对象，但是这个对象和数组一样key是用数字索引下标 也有length属性，如arguments 对象 和 dom api 返回的 NodeList 都是类数组对象，
类数组对象不能使用 push、slice、pop、shift等数组方法，但是可以通过一些办法将类数组转换成数组来使用数组的api

**Array.prototype.slice.call**
```
function test() {
    arguments = Array.prototype.slice.call(arguments)
    console.log(arguments);
}

test(1, 2, 3, 4, 5)
```
**Array.from**
Array.from 可以将两类对象转为真正的数组：类数组对象和可遍历对象（iterable） 包括ES6新增的数据结构Map、Set
```
function test() {
    arguments = Array.from(arguments)
    console.log(arguments);
}

test(1, 2, 3, 4, 5)
```
**扩展操作符方式**
```
function  test(){
 console.log([...arguments])
}
```
为什么要有类数组对象呢？类数组对象解决了什么问题？
```
JavaScript类型化数组是一种类似数组的对象，并提供了一种用于访问原始二进制数据的机制。 Array存储的对象能动态增多和减少，并且可以存储任何JavaScript值。JavaScript引擎会做一些内部优化，以便对数组的操作可以很快。然而，随着Web应用程序变得越来越强大，尤其一些新增加的功能例如：音频视频编辑，访问WebSockets的原始数据等，很明显有些时候如果使用JavaScript代码可以快速方便地通过类型化数组来操作原始的二进制数据，这将会非常有帮助。
```
总结来说就是 可以更快的操作复杂数据。

**call 和 apply的模拟实现**
call 和 apply 主要的表现有：
+ 可以改变this的指向
+ 函数通过调用call 和 apply 函数执行
+ call 和 apply 可以传入 null 和 undefined 此时的this 应该指向window
+ 可以传入基本数据类型，此时会使用Object 来转换
+ 函数可以有返回值
```
// call
Function.prototype.myCall = function (target) {
    target = target ? Object(target) : window;
    let args = [].slice.call(arguments).splice(1);
    target.handler = this;
    let ret = target.handler(...args);
    delete target.handler;
    return ret;
}

// apply
Function.prototype.myApply = function (target, args = []) {
    target = target ? Object(target) : window;
    target.handler = this;
    let ret = target.handler(...args);
    delete target.handler;
    return ret;
}
```






















