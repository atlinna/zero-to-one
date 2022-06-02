# this全面解析

理解 this 的绑定过程之前，首先要理解调用位置：调用位置就是函数在代码中被调用的位置（而不是声明的位置）。
**分析出真正的调用位置很重要，因为它决定了 this 的绑定。**

## 绑定规则
### 默认绑定
首先要介绍的是最常用的函数调用类型：独立函数调用。可以把这条规则看作是无法应用其他规则时的默认规则。
示例：
```
    function test() {
        console.log(this.a);
    }

    var a = 10;
    test() // 10；
```
首先我们是在全局作用域中声明的变量 a ，那么这个变量 a 本质上也是全局对象的一个属性，他们是相同的一个东西。
然后调用了 test 函数发现，this.a 被解析成了全局变量 a。这是什么原因呢？ 因为在调用函数的时候应用了 this 的**默认绑定**，因此 this 指向全局对象。
foo 是直接使用不带任何修饰的函数引用进行调用的，因此只能使用**默认绑定**，无法应用其他规则。
**如果使用严格模式（ strict mode ），那么全局对象将无法使用默认绑定，因为 this 会绑定到 undefined ：**
虽然 this 的绑定规则完全取决于调用位置，但是只有 foo() 运行在非 strict mode 下时，默认绑定才能绑定到全局对象；严格模式下与 foo()的调用位置无关

### 隐式绑定
另一条需要考虑的规则是调用位置是否有上下文对象，或者说是否被某个对象拥有或者包含，不过这种说法可能会造成一些误导。
示例：
```
    function test() {
        console.log(this.a);
    }

    var obj = {
        a: 10,
        test: test
    }
    var a = 20;
    obj.test() // 10
```
还是上一个 test 函数，这次我们在全局中声明了一个变量 a 和一个对象 obj。对象中也有一个同名属性 a。 和一个函数 test，调用位置会使用 obj 上下文来引用函数，因此你可以说函数被调用时 obj 对象“拥有”或者“包含”它。当 foo() 被调用时，它的落脚点确实指向 obj 对象。
**当函数引用有上下文对象时，隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象。**
对象引用链中只有最后一层才会影响调用位置，如下示例：
```
        function test() {
            console.log(this.a);
        }

        var obj = {
            a: 10,
            test: test
        }
        var obj2 = {
            a:30,
            obj:obj
        }
        var obj3 = {
            a:40,
            obj:obj2
        }
        var a = 20;
        obj3.obj.obj.test() // 10
```
### 1 - 隐式丢失
一个最常见的 this 绑定问题就是**被隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定，从而把 this 绑定到全局对象或者 undefined 上，取决于是否是严格模式。**
示例：
```
        function test() {
            console.log(this.a);
        }

        var a = 5;

        var obj = {
            a: 10,
            test: test
        }

        var func = obj.test;

        func() // 5
```
此时控制台打印出的是5，因为我们使用一个新的变量保存了 obj.test 的引用，也就是说 func 直接引用的 test 函数，等同于引用本身。 那么当你不加任何修饰直接调用的话就会使用默认绑定的规则。

同样的情况还会发生在**使用回调函数上**，如示例：
```
        function test() {
            console.log(this.a);
        }

        function midTravel(callback) {
            callback()
        }

        var a = 5;

        var obj = {
            a: 10,
            test: test,
        }

        midTravel(obj.test)
```
我们发现当回调函数调用执行后打印出的结果是 5，this 指向的是 window ，应用了**默认绑定**，这是为什么呢？
我们知道参数传递其实就是**赋值**，只不过他是隐式的我们看不到。
**参数传递其实就是一种隐式赋值，因此我们传入函数时也会被隐式赋值，**
所以平时我们要注意：```调用回调函数的函数可能会修改 this 。```

### 2 - 显式绑定
显示绑定就是通过内置 api 来帮助我们修改 this 的指向。
首先介绍的是 call 和 apply；
从 this 绑定的角度来说， call(..) 和 apply(..) 是一样的，它们的区别体现在其他的参数上，但是现在我们不用考虑这些。
```
        function test() {
            console.log(this.a);
        }

        var a = 5;

        var obj = {
            a: 10,
            test: test,
        }

        test.call(obj) // 10
```
#### 3 - 硬绑定
故名思意，强行绑定 this 指向，后续无法进行 this 的修改，这是显式绑定的一个变种。
```
        function test() {
            console.log(this.a);
        }

        function func() {
            test.call(obj)
        }

        var a = 5;

        var obj = {
            a: 10,
            test: test,
        }

        func() // 10
        func.call(window) // 10
```
其实就是通过一个函数使用 call 绑定 this ，然后再由一个中间函数将其包裹。
硬绑定的应用场景就是创建一个包裹函数，或一个可以重复使用的辅助函数。
```
// 1 - 创建一个包裹函数
    function test(params) {
        console.log(this.name + ' like ' + params);
    }

    var func = function (params) {
        return test.call(obj, params)
    }

    var obj = {
        name:'zhang san'
    }

    func('football')
// 2 - 创建可重复使用的辅助函数
    function test(params) {
        console.log(this.name + ' like ' + params);
    }

    function bind(fn, obj) {
        return function () {
            return fn.apply(obj, arguments)
        }
    }

    var obj = {
        name: 'zhang san'
    }

    var obj1 = {
        name: 'wang wu'
    }

    var func = bind(test, obj)
    var func_wang = bind(test, obj1)
    func('football')
    func('basketball')

    func_wang('football')
```
由于硬绑定是一种非常常用的模式，所以在 ES5 中提供了内置的方法 Function.prototype.bind
bind(..) 会返回一个硬编码的新函数，它会把参数设置为 this 的上下文并调用原始函数。 

##### API 调用的上下文
第三方库的许多函数，以及 JavaScript 语言和宿主环境中许多新的内置函数，都提供了一
个可选的参数，通常被称为“上下文”（context），其作用和 bind(..) 一样，确保你的回调
函数使用指定的 this 。
如 forEach 中第二个参数是传入一个对象，然后将 this 绑定到这个对象上。

#### 4 - new 绑定
在传统的面向类的语言中，“构造函数”是类中的一些特殊方法，使用 new 初始化类时会
调用类中的构造函数。通常的形式是这样的：
```
    something = new MyClass(..);
```
JavaScript 也有一个 new 操作符，使用方法看起来也和那些面向类的语言一样，绝大多数开
发者都认为 JavaScript 中 new 的机制也和那些语言一样。然而，JavaScript 中 new 的机制实
际上和面向类的语言完全不同。

在 JavaScript 中，构造函数只是一些
使用 new 操作符时被调用的函数。它们并不会属于某个类，也不会实例化一个类。实际上，
它们甚至都不能说是一种特殊的函数类型，它们只是被 new 操作符调用的普通函数而已。

所以，包括内置对象函数（比如 Number(..) ）在内的所有函数都可
以用 new 来调用，这种函数调用被称为构造函数调用。这里有一个重要但是非常细微的区
别：实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”。

使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。
+ 1. 创建（或者说构造）一个全新的对象。
+ 2. 这个新对象会被执行 [[ 原型 ]] 连接。
+ 3. 这个新对象会绑定到函数调用的 this 。
+ 4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。

### 优先级
+ 1. 函数是否在 new 中调用（ new 绑定）？如果是的话 this 绑定的是新创建的对象。
var bar = new foo()
+ 2. 函数是否通过 call 、 apply （显式绑定）或者硬绑定调用？如果是的话， this 绑定的是
指定的对象。
var bar = foo.call(obj2)
+ 3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话， this 绑定的是那个上
下文对象。
var bar = obj1.foo()
+ 4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefined ，否则绑定到
全局对象。

### 绑定例外
如果你把 null 或者 undefined 作为 this 的绑定对象传入 call 、 apply 或者 bind ，这些值
在调用时会被忽略，实际应用的是默认绑定规则
一种“更安全”的做法是传入一个特殊的对象，把 this 绑定到这个对象不会对你的程序
产生任何副作用。
 Object.create(null) 和 {} 很像，但是并不会创建 Object.
prototype 这个委托，所以它比 {} “更空”

**间接引用**
间接引用最容易在赋值时发生
```
        function test() {
            console.log(this.name);
        }

        var obj = {
            name: 'zhang san',
            test: test
        }

        var obj1 = {
            name: 'wang wu'
        };

        var name = 'global here';

        (obj1.test = obj.test)() // golbal here;
```
原因是因为 这个赋值表达式的返回值是目标函数 test 的引用，因此调用时相当于直接调用，没有任何的修饰。所以会应用默认绑定。

**对于默认绑定来说，决定 this 绑定对象的并不是调用位置是否处于严格模式，而是
函数体是否处于严格模式。如果函数体处于严格模式， this 会被绑定到 undefined ，否则
this 会被绑定到全局对象。**

**软绑定**
```
        Function.prototype.softBind = function (obj) {
            var fn = this;
            // 捕获所有 curried 参数
            var curried = [].slice.call(arguments);
            var bound = function () {
                console.log(this, obj);
                return fn.apply(
                    (!this || this === (window || global)) ?
                        null : this,
                    curried.concat.apply(curried, arguments)
                );
            };
            bound.prototype = Object.create(fn.prototype);
            return bound;
        };
```

### this 词法
箭头函数
箭头函数并不是使用 function 关键字定义的，而是使用被称为“胖箭头”的操作符 => 定
义的。箭头函数不使用 this 的四种标准规则，而是根据外层（函数或者全局）作用域来决
定 this 。

箭头函数的实质是相当于箭头函数外部存在一个变量保存当前作用域 this 
```
        function test() {
            var self = this;
            return () => {
                console.log(this, this == self);
            }
        }

        var obj = {
            name:'zhang san'
        }

        var func = test.call(obj)
        func()
```

**其重要性还体现在它用更常见的词法作用域取代了传统的 this 机制。**
