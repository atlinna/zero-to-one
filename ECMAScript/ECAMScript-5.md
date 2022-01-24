# ECAMScript-5 
## This toturial will teach you javascript from basic to advanced 
## come on,let's go get start it!

** First! Learn to use documents **
https://www.w3schools.com/js/js_whereto.asp

### some knowledges
```
  javascript and java are completely different languages,both in concept and design.JavaScript was invented by Brendan Eich in 1995,
  and became an ECMA standard in 1997.
```

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
那种罐装一端开口的薯片 叫啥忘了（没吃过的建议自己买一罐，可比克还是啥的）



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

### 类型转换
js 可以通过一些内置的构造函数或方法来将一种类型转换成另外一种类型，如 字符串 转换成 数字
```
 有构造函数Number、String、Boolean、Symbol 构造函数 分别能将数据转为 数字、字符串、布尔值、标记值。
 
 
```
