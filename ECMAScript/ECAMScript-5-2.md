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
Object.prototype.isObj = function (target) {
    return target && typeof target === 'object';
}
Array.prototype.isArray = function (target) {
    return Object.prototype.toString.call(target) === '[object Array]'
}

function findFlag(list, target) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].target === target) {
            return list[i];
        }
    }
    return null;
}

Object.defineProperty(Object, 'cloneDeep', {
    value: function (target, flagStack) {
        if (!Object.isObj(target)) return target // 判断是否是对象 如果不是则返回此类型
        if (!flagStack) flagStack = []; // 新增代码，初始化数组
        var source = Array.isArray(target) ? [] : {}; // 兼容数组
        var dta = findFlag(flagStack, target)

        if (dta) return dta.source
        flagStack.push({
            source,
            target
        })
        for (var prop in target) {
            if (Object.prototype.hasOwnProperty.call(target, prop)) {
                if (Object.isObj(target[prop])) {
                    source[prop] = Object.cloneDeep(target[prop], flagStack)
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
// var a = [1, 2, 3, [4, 5]]
// var b = Object.cloneDeep(a)
// a[3][1] = 10
// console.log(a, b);
var a = {
    s: 'obj'
}
a.tina = a
var b = Object.cloneDeep(a)
console.log(b);
/*测试正常*/

// 还有第二种方式就是使用哈希表，但是 WeakMap 是 ES6中的知识。
Object.defineProperty(Object, 'cloneDeep', {
    value: function (target, hashmap = new WeakMap()) {
        if (!Object.isObj(target)) return target // 判断是否是对象 如果不是则返回此类型
        if (hashmap.has(target)) return hashmap.get(target)
        var source = Array.isArray(target) ? [] : {}; // 兼容数组
        hashmap.set(target, source)
        for (var prop in target) {
            if (Object.prototype.hasOwnProperty.call(target, prop)) {
                if (Object.isObj(target[prop])) {
                    source[prop] = Object.cloneDeep(target[prop], hashmap)
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
// var a = [1, 2, 3, [4, 5]]
// var b = Object.cloneDeep(a)
// a[3][1] = 10
// console.log(a, b);
var a = {
    s: 'obj'
}
a.tina = a
var b = Object.cloneDeep(a)
console.log(b);
```
有的同学就会发现了 说 我们用的都是递归的方式，那么就会存在递归爆栈的问题 
爆栈 --》 RangeError: Maximum call stack size exceeded
了解算法的同学可能会更好的了解 递归可以转化成while循环的方式。
```
Object.prototype.isObj = function (target) {
    return target && typeof target === 'object';
}
Array.prototype.isArray = function (target) {
    return Object.prototype.toString.call(target) === '[object Array]'
}

function findFlag(list, target) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].target === target) {
            return list[i];
        }
    }
    return null;
}

Object.defineProperty(Object, 'cloneDeep', {
    value: function (target) {

        if (!Object.isObj(target)) return target // 判断是否是对象 如果不是则返回此类型
        var source = Array.isArray(target) ? [] : {}; // 兼容数组   

        const loopList = [
            {
                parent: source,
                key: undefined,
                data: target
            }
        ]

        while (loopList.length) {
            let node = loopList.pop();
            let parent = node.parent;
            let key = node.key;
            let data = node.data;
            let ret = parent;
            if (key !== undefined) {
                ret = parent[key] = Array.isArray(target) ? [] : {}
            }

            for (let prop in data) {
                if (data.hasOwnProperty(prop)) {
                    if (Object.isObj(data[prop])) {
                        loopList.push({
                            parent: ret,
                            key: prop,
                            data: data[prop]
                        })
                    } else {
                        ret[prop] = data[prop]
                    }
                }
            }

        }
        return source
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
console.log(a, b);
a.book.title = 'People of Nature'
console.log(a, b);
```
**Lodash 中的深拷贝是如何实现的：**  https://github.com/yygmind/blog/issues/31  
整体流程
入口文件是cloneDeep.js，直接调用核心文件baseClone.js的方法
```
const CLONE_DEEP_FLAG = 1;
const CLONE_SYMBOLS_FLAG = 4;

/**
 * baseClone
 * @param { 需要拷贝的对象 } value 
 * @param { 位掩码（Bitwise） }
 * @returns 
 */
function cloneDeep(value) {
    return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG)
}
```
**baseClone 方法** 
先介绍该方法的参数 baseClone(value,bitmask,custoizer,key,object,stack)
+ value: 需要拷贝的对象
+ bitmask: 位掩码，其中1是深拷贝，2拷贝原型链上的属性，4是拷贝Symbols属性
+ customizer: 定制的clone函数
+ key: 传入value值的key
+ object: 传入value值的父对象
+ stack: Stack 栈， 用来处理循环引用

完整代码：
```
function baseClone(value, bitmask, customizer, key, object, stack) {
    let result

    // 标志位
    const isDeep = bitmask & CLONE_DEEP_FLAG		// 深拷贝，true
    const isFlat = bitmask & CLONE_FLAT_FLAG		// 拷贝原型链，false
    const isFull = bitmask & CLONE_SYMBOLS_FLAG	// 拷贝 Symbol，true

    // 自定义 clone 函数
    if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value)
    }
    if (result !== undefined) {
        return result
    }

    // 非对象  
    if (!isObject(value)) {
        return value
    }
    
    const isArr = Array.isArray(value)
    const tag = getTag(value)
    if (isArr) {
        // 数组
        result = initCloneArray(value)
        if (!isDeep) {
            return copyArray(value, result)
        }
    } else {
        // 对象
        const isFunc = typeof value == 'function'

        if (isBuffer(value)) {
            return cloneBuffer(value, isDeep)
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
            result = (isFlat || isFunc) ? {} : initCloneObject(value)
            if (!isDeep) {
                return isFlat
                    ? copySymbolsIn(value, copyObject(value, keysIn(value), result))
                	: copySymbols(value, Object.assign(result, value))
            }
        } else {
            if (isFunc || !cloneableTags[tag]) {
                return object ? value : {}
            }
            result = initCloneByTag(value, tag, isDeep)
        }
    }
    // 循环引用
    stack || (stack = new Stack)
    const stacked = stack.get(value)
    if (stacked) {
        return stacked
    }
    stack.set(value, result)

    // Map
    if (tag == mapTag) {
        value.forEach((subValue, key) => {
            result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack))
        })
        return result
    }

    // Set
    if (tag == setTag) {
        value.forEach((subValue) => {
            result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack))
        })
        return result
    }

    // TypedArray
    if (isTypedArray(value)) {
        return result
    }

    // Symbol & 原型链
    const keysFunc = isFull
    	? (isFlat ? getAllKeysIn : getAllKeys)
    	: (isFlat ? keysIn : keys)

    const props = isArr ? undefined : keysFunc(value)
    
    // 遍历赋值
    arrayEach(props || value, (subValue, key) => {
        if (props) {
            key = subValue
            subValue = value[key]
        }
        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack))
    })
    
    // 返回结果
    return result
}
```
我们将源码分为了下面几个部分来阅读
+ 位掩码
+ 定制 clone 函数
+ 非对象
+ 数组 & 正则
+ 对象 & 函数
+ 循环引用
+ Map & Set
+ Symbol & 原型链

#### 位掩码
位掩码参数定义如下
```
const CLONE_DEEP_FLAG = 1   // 1 即 0001，深拷贝标志位
const CLONE_FLAT_FLAG = 2   // 2 即 0010，拷贝原型链标志位
const CLONE_SYMBOLS_FLAG = 4    // 4 即 0100，拷贝 Symbols 标志位
```
位掩码用于处理同时存在多个布尔选项的情况，其中**掩码中的每个选项的值都等于 2 的幂。** 相比直接使用变量来说，优点是可以节省没存
```
 // cloneDeep 添加标志位，1|4 即 0001 | 0100 即 0101 即 5
 CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG
 
 let result;
 const isDeep = bitmask & CLONE_DEEP_FLAG   // 5 & 1 即 1 true
 const isFlat = bitmask & CLONE_FLAT_FLAG   // 5 & 2 即 0 false
 const isFull = bitmask & CLONE_SYMBOLS_FLAG    // 5 & 4 即 4 true
```
常用的基本操作如下：
+ a | b: 添加标志位 a 和 b
+ mask & a: 去除标志位 a
+ mask & ~a: 清除标志位 a
+ mask ^ a: 取出与 a 的不同部分

#### 定制 clone 函数
```
if (customizer) {
	result = object ? customizer(value, key, object, stack) : customizer(value)
}
if (result !== undefined) {
    return result
}
```
上面代码是当存在 customizer 的情况时 如果 存在 value 值的父对象，就传入 value，key，object，stack 这几个参数，如果不存在 value 的父对象 object 则只传入 value 执行定制函数。
函数的返回值 result 不为空则返回执行结果。

#### 非对象
```
if (!isObject(value)) {
    return value;
}

// ../isObject.js
function isObject(value) {
    const type = typeof value;
    return value != null && (type == 'object' || type ='function');
}
```
这里判断 value 是否为对象，如果不是则直接返回这个值，用来判断对象的方法和我们的相差不大，只不过他这里多了一个 function 类型






