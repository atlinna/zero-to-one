### new 运算符
接下来我们用new 操作符来创建一个 Person 实例
```
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.sayName = function () {
    return this.name + ' --> ' + this.age + ' years old';
}

var p = new Person('zhang san', 18);

console.log(p.sayName());
```
我们可以看出 new 创建出来的实例有两个特性：
+ 可以访问构造函数中的属性
+ 可以范文原型中的属性

**模拟实现**
实现前要先分析 
假设 我们现在运行 new Person
+ 首先会创建一个新对象
+ 新对象的原型指向 Person.prototype
+ 将函数的this 绑定为 新对象 为新对象添加属性
+ 返回新对象（构造函数如果有返回值就返回构造函数的值）。

```
// 模拟 new 
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.sayName = function () {
    return this.name + ' --> ' + this.age + ' years old';
}

// 模拟 new 
function NEW() {
    var obj = new Object()
    arguments = Array.prototype.slice.call(arguments)
    var fun = arguments.shift(0);
    obj.__proto__ = fun.prototype
    var ret = fun.apply(obj, arguments)
    return ret instanceof Object ? ret : obj
}

// var p = new Person('zhang san', 18);
var p = NEW(Person, 'zhangsan', 19)

console.log(p);
```
### 深浅拷贝原理
为什么会出现深浅拷贝？
原因是因为我们知道基本数据赋值是直接赋值，修改之后互不影响，但是如果是引用类型的数据，我们赋值本质上是这个值的地址，如果其中一个改变，那么这个地址中的值就改变了，所有的值都会更新。
于是 深浅拷贝 应运而生。
那么浅拷贝和深拷贝又要怎么区分呢？
首先你要知道什么是拷贝：
就是创建了一个新对象，对象中是原对象的精确拷贝，如果是基本类型就复制基本类型，如果属性是引用类型就复制引用类型，拷贝的是引用数据的内存地址。
浅拷贝呢就相当于只解决了第一层的问题，后面还是会出现。深拷贝就相当于完美解决了这个问题。
**浅拷贝使用场景**
1、Object.assign()
Object.assign作用是将所有可枚举属性的值从一个或多个元对象中复制到目标对象，然后返回这个目标对象。 （这是个浅拷贝）
```
var a = {
    name: 'zhang san',
    book: {
        'nature': 'peoples of nature',
        'technology': 'Bill Gates'
    }
}


var a_a = Object.assign({}, a)
console.log(a, a_a);
a.name = 'li si'
console.log(a, a_a);
a.book.nature = 'lots of moneys'
console.log(a, a_a);

```
我们来分析一下上面的行为 首先创建了一个对象 a a中 有两个属性分别是基本数据和引用数据 ，现在又创建了一个对象a_a 来接受Object.assign合并后的值 目标对象是 ‘{}’ 
当我们修改a中的基本数据时，发现这个浅拷贝是好用的 两个对象互不影响，可是 当我们修改引用类型的时候 我们发现所有的值都变了。
2、ES6 展开操作符 （浅拷贝）
3、Array.prototype.slice()
slice 方法返回一个新的数组对象，这一对象是一个由begin 和 end（不包括end）决定的原数组的浅拷贝，原始数组不会改变
```
let arr = [1, '2', 3, [4, 5]]

let brr = arr.slice(0, arr.length)
arr[0] = 10
arr[3][0] = 2
console.log(brr);
```
我们发现改变 arr[0]的值 brr 中的值没有改变 但是改变 arr[3][0]的值后 brr[3][0]的值也跟着改变 说明 slice 方法是浅拷贝。 **相应的还有 concat**
