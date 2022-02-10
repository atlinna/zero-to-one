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

- - -
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
- - -
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
```
let a = {
    name: 'zhangsan',
    age: '19',
    like: null,
    id: Symbol('zhangsan'),
    next: undefined
}

let b = Object.assign({}, a)

console.log(a,b);
```
String 类型 和 Symbol 类型的属性都会被拷贝，而且不会跳过那些值为null 或 undefined 的源对象。
**Object.assign 的模拟实现**  
首先我们看下Object.assign的特征：
+ 1、判断原生 Object 是否支持该函数，如果不存在的话创建一个函数 assign，并使用 Object.defineProperty 将该函数绑定到 Object 上。
+ 2、判断参数是否正确 目标对象不能为空，可以为空对象但是不能不设置值。
+ 3、使用Object（）转成对象，并保存为 to ，最后返回这个对象 to。
+ 4、使用 for ··· in 循环遍历出所有可枚举的自由属性。并复制给新的目标对象（使用hasOwnProperty 获取自由属性，即非原型链上的属性）。
代码实现：
```
if (typeof Object.myAssign !== 'function') {
    Object.defineProperty(Object, 'myAssign', {
        value: function (target) {
            if (target == null) {
                throw new Error('Cannot Convert null to object')
            }
            var to = Object(target)

            for (var i = 1; i < arguments.length; i++) {
                var propSource = arguments[i]
                if (propSource) {
                    for (var prop in propSource) {
                         if (Object.prototype.hasOwnProperty.call(propSource, prop)) {
                             to[prop] = propSource[prop]
                         }
                    }
                }
            }

            return to
        },
        writable: true,
        configurable: true
    })
}

var b = Object.myAssign({}, { name: 'zhangsan' }, { age: 18 });
console.log(b);

注意：
1、可枚举性
原生情况下挂载在Object上的属性是不可枚举的，但是直接在Object上挂载属性是可枚举的，所以这里必须使用Object.defineProperty,并设置enumerable:false,writable:true,configurable:true.
for (var key in Object) {
    console.log(key);
}
console.log(Object.keys(Object));
我们也可以使用Object.getOwnPropertyDescriptor 或者Object.propertyIsEnumerable 来查看Object.assign 是否可枚举
console.log(Object.getOwnPropertyDescriptor(Object, 'assign')); // 可以看到defineProperty的配置对象
 {
        writable: true, // 可写
        enumerable: false, // 可枚举
        configurable: true, // 可配置
        value: ƒ
    }
2、判断参数是否正确
有些文章判断参数是否正确是这样判断的
if(target === undefined || target === null){
    throw new TypeError('Cannot convert undefined or null to object!')
}
这样写就没有必要了，因为 undefined 和 null 是相等的 即 undefined == null 为 true，
所以我们只需要判断 我们的目标对象 是否等于 null 即可。
```

2、ES6 展开操作符 （浅拷贝）
3、Array.prototype.slice() （浅拷贝）
slice 方法返回一个新的数组对象，这一对象是一个由begin 和 end（不包括end）决定的原数组的浅拷贝，原始数组不会改变
```
let arr = [1, '2', 3, [4, 5]]

let brr = arr.slice(0, arr.length)
arr[0] = 10
arr[3][0] = 2
console.log(brr);
```
我们发现改变 arr[0]的值 brr 中的值没有改变 但是改变 arr[3][0]的值后 brr[3][0]的值也跟着改变 说明 slice 方法是浅拷贝。 **相应的还有 concat**

**深拷贝**
深拷贝会拷贝所有的属性，并且拷贝属性指向的内存，就相当于把源对象及对象中所有的属性（基本数据，引用数据）全部拷贝即为深拷贝。
深拷贝相比于浅拷贝速度慢，花销大 看情况使用。

**深拷贝使用场景**
1、JSON.parse(JSON.stringify(Object))
```
var a = {
    name: 'zhangsan',
    age: 19,
    books: {
        nature: 'people of nature',
        technology: 'Bill Gates'
    }
};

var b = JSON.parse(JSON.stringify(a));

console.log(a, b);
a.name = 'li si';
console.log(a, b);
b.books.nature = 'Man And Nature';
console.log(a, b);
```
发现改变不同的数据 两个对象之间互不影响。
再试试对数组的深拷贝
```
var a = [1, 2, 3, [4, 5]]

var b = JSON.parse(JSON.stringify(a))

console.log(a, b);
a[0] = 10
console.log(a, b);
b[3][1] = 0
console.log(a, b);
```
对数组深拷贝之后，改变原数组不会影响到拷贝之后的数组。
但是使用JSON API 实现深拷贝是有弊端的
+ 1、如果obj中存在时间对象，深拷贝后时间是字符串形式，而不是对象的形式
+ 2、如果obj中有RegExp，则打印出来是空对象
+ 3、如果obj中有函数或者undefined，则会直接被丢弃
+ 4、如果对象是由构造函数生成，则会丢掉对象的constructor
+ 5、如果对象中存在循环引用的情况，无法正确实现深拷贝
+ 6、如果对象中存在NaN，则序列化后会变成null
下面我们来看下这些问题：
```
// 1、如果obj中存在时间对象，深拷贝后时间是字符串形式，而不是对象的形式
var obj = {
    time: new Date()
}

var a = JSON.parse(JSON.stringify(obj))

console.log(obj, typeof obj.time, a, typeof a.time); 
// {time: Wed Feb 09 2022 14:56:13 GMT+0800 (中国标准时间)}time: Wed Feb 09 2022 14:56:13 GMT+0800 (中国标准时间) {}__proto__: Object "object"
/* {time: "2022-02-09T06:56:13.002Z"} "string"
time: "2022-02-09T06:56:13.002Z"
__proto__: Object
*/
/*
    我们发现深拷贝之后的数据变成了字符串，这个如何解决呢？ 我们把日期对象转为时间戳
*/
var obj = {
    time: (new Date()).valueOf()
}

var a = JSON.parse(JSON.stringify(obj))

console.log(obj, typeof obj.time, a, typeof a.time);
/*现在我们转换后的数据是不是就一致了*/

// -------------------------------------------------
// 2、如果obj中有RegExp，则打印出来是空对象
var obj = {
    reg: new RegExp(/\/\.{1,10}/)
}

var a = JSON.parse(JSON.stringify(obj))

console.log(obj, a);
// 我们发现经过深拷贝之后 a 变为了 空对象。
// -------------------------------------------------
// 3、如果obj中有函数、Symbol 或者 undefined，则会直接被丢弃
var obj = {
    a: function () { },
    b: undefined,
    c: Symbol('hello')
}

var a = JSON.parse(JSON.stringify(obj))

console.log(obj, a);

// -------------------------------------------------
// 4、如果对象是由构造函数生成，则会丢掉对象的constructor
function Person(name, age) {
    this.name = name;
    this.age = age;
}

let p = new Person('zhangsan', 19)

var obj = {
    person: p
}


let b = JSON.parse(JSON.stringify(p))

console.log(obj, b);
console.log(p instanceof Person, b instanceof Person);
// 发现此时经过深拷贝后的对象原型已经不再指向我们的构造函数
// -------------------------------------------------
// 5、如果对象中存在循环引用的情况，无法正确实现深拷贝
var a = {
    name: 'zhangsan'
}

a.a = a;

console.log(a);

var b = JSON.parse(JSON.stringify(a))
console.log(a, b);
/*
    Uncaught TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    --- property 'a' closes the circle
    at JSON.stringify (<anonymous>)
*/
// -------------------------------------------------

// 6、如果对象中存在NaN，则序列化后会变成null
var a = {
    num:NaN
}


var b = JSON.parse(JSON.stringify(a))
console.log(a, b);

// -------------------------------------------------

```
**浅拷贝的实现：** 
```
var shallowCopy = function (target) {
    var to = new Object();
    for (var prop in target) {
        if (Object.prototype.hasOwnProperty.call(target, prop)) {
            to[prop] = target[prop];
        }
    }
    return to
}


var a = {
    name: 'zhang san',
    age: 18,
    book: {
        title: 'Man And Nature',
        price: 100
    }
}

var b = shallowCopy(a)
console.log(b);
a.name = 'li si';
console.log(b);
a.book.title = 'People of Nature';
console.log(b);
```
**实现深拷贝：**
```
Object.defineProperty(Object, 'cloneDeep', {
    value: function (target) {
        var source = {};
        for (var prop in target) {
            if (Object.prototype.hasOwnProperty.call(target, prop)) {
                if (typeof target[prop] == 'object') {
                    source[prop] = Object.cloneDeep(target[prop])
                } else {
                    source[prop] = target[prop]
                }
            }
        }
        return source;
    },
    writable: false,
    configurable: true
})

var a = {
    name: 'zhang san',
    age: 18,
    book: {
        title: 'Man And Nature',
        price: 19
    }
}

var b = Object.cloneDeep(a)
a.book.title = 'People of Nature';
console.log(a, b);
```
测试通过 这样就完成了一个简单的深拷贝， 但是这样的深拷贝会存在一些问题
+ 没有正确的判断入参的类型 和 返回参数的类型 比如 如果参数为null 返回的 却是一个空对象。
+ 不能兼容数组
+ 重复引用问题
接下来我们依次完善我们的深拷贝
首先我们解决参数类型的问题
```
/*
    之前我们通过一些方式来判断参数是否为数组，同样我们可以用这种方式来判断我们的参数是否是 对象
*/
Object.prototype.isObj = function (target) {
    return Object.prototype.toString.call(target) == '[object Object]';
}
// 修改我们 deepClone 的代码
Object.prototype.isObj = function (target) {
    return Object.prototype.toString.call(target) == '[object Object]';
}
Object.defineProperty(Object, 'cloneDeep', {
    value: function (target) {
        if (!Object.isObj(target)) return target // 判断是否是对象 如果不是则返回此类型
        var source = {};
        for (var prop in target) {
            if (Object.prototype.hasOwnProperty.call(target, prop)) {
                if (Object.isObj(target[prop])) {
                    source[prop] = Object.cloneDeep(target[prop])
                } else {
                    source[prop] = target[prop]
                }
            }
        }
        return source;
    },
    writable: false,
    configurable: true
})

var a = {
    name: 'zhang san',
    age: 18,
    book: {
        title: 'Man And Nature',
        price: 19
    }
}

a = null

var b = Object.cloneDeep(a)
// a.book.title = 'People of Nature';
console.log(a, b);

/*测试正常 不是对象类型的都会返回对应值*/
/*
    我们来看下一个兼容数组，我们想一下如果要兼容数组的话 我们用来判断对象的方式，是不是就不妥当了，因为如果是数组的话 返回的应该是[object Array] 
    所以我们这里判断类型还是要使用 typeof 但是如果使用typeof的话要注意一些小细节
    typeof null // object
    typeof {} // object
    typeof [] // object
 */
Object.prototype.isObj = function (target) {
    return target && typeof target === 'object';
}
Array.prototype.isArray = function (target) {
    return Object.prototype.toString.call(target) === '[object Array]'
}
Object.defineProperty(Object, 'cloneDeep', {
    value: function (target) {
        if (!Object.isObj(target)) return target // 判断是否是对象 如果不是则返回此类型
        var source = Array.isArray(target) ? [] : {}; // 兼容数组
        for (var prop in target) {
            if (Object.prototype.hasOwnProperty.call(target, prop)) {
                if (Object.isObj(target[prop])) {
                    source[prop] = Object.cloneDeep(target[prop])
                } else {
                    source[prop] = target[prop]
                }
            }
        }
        return source;
    },
    writable: false,
    configurable: true
})

// 测试一下
var a = [1, 2, 3, [4, 5]]
var b = Object.cloneDeep(a)
a[3][1] = 10
console.log(a, b);
/* 测试正常，能够兼容数组 */
/* 下一个问题，重复引用的问题，解决这个问题的本质是找到并返回重复引用的地方就可以了？ */

```
