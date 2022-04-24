### new 操作符

#### 描述
首先我们要直到 new 关键字在调用和结束这一段过程中做了什么事。

+ 1、创建一个空的简单 JavaScript 对象 即 {}
+ 2、为**步骤1**新创建的对象添加属性 __proto__,将该属性**链接至构造函数的原型对象**；
+ 3、将**步骤1**新创建的对象作为 this 的上下文；
+ 4、如果**该函数没有返回对象，则返回 this**。


#### 初步代码实现：
```
    function NEW() {
        // 1、创建一个空对象
        let obj = {};
        // 2、为对象添加__proto__ 属性，并链接至构造函数的原型对象
        let constructor = Array.prototype.shift.call(arguments);
        obj.__proto__ = constructor.prototype;
        // 3、步骤1新创建的对象作为this的上下文
        let result = constructor.apply(obj, Array.prototype.slice.call(arguments));
        // 4、如果该函数没有返回对象，则返回this
        return result instanceof Object ? result : obj;
    }
```

#### 分析：
分析下 W3C 标准的描述
首先我们看第一步 创建一个 空对象 如果你直接 var obj = {}; 这样可以，但是不好，你可以打印出这个对象，我们可以看到，他只是属性为空，但是我们能看到他有原型对象，Object，这一步我们可以通过
Object.create 来优化，能够帮我们创建一个空对象，真正意义上的空对象。

第二步，将这个空对象的原型链接到构造函数的原型对象，如果我们直接就使用 **obj.__proto__ = constructor.prototype;** 来实现，可以但不是最优解，在W3C标准中明确的告诉了我们，不要直接读取或修改对象的原型，他呢推荐我们使用 Object 中的 setPrototypeOf，getPrototypeOf 方法来读取和修改某个对象的原型。但是我们的目的只是将对象创建并链接到构造函数的原型对象。这个也可以通过 Object.create 优化，它通过接受一个原型对象，然后将创建的对象直接链接到这个原型对象上。

第三步，修改 this ，call/apply 任选其一，这里我们选择 apply 直接将 arguments 以 Array 的方式传递进去， call 也是可以的，切记 apply 并不是接受一个数组。

第四步，首先看最后 **返回 this** this指代的是什么？ 是不是你修改后的构造函数的 this ，这个构造函数的 this 又是谁？ 是不是我们创建的这个对象？ 然后我们怎么判断这个函数会不会返回结果呢？

我们看下如果返回的话结果是什么？ 是个对象对吧，那简单了，只要他的原型链上有 Object 的原型，我们就返回这个结果嘛，不存在的话 我们就返回这个新对象呗。


#### 优化后：
```
    function NEW() {
        // 1、创建一个空对象
        // 2、为对象添加__proto__ 属性，并链接至构造函数的原型对象
        let constructor = Array.prototype.shift.call(arguments);
        if(typeof constructor !== 'function') throw new TypeError(constructor + ' is not a func')
        
        let obj = Object.create(constructor.prototype);
        // 3、步骤1新创建的对象作为this的上下文
        let result = constructor.apply(obj, Array.prototype.slice.call(arguments));
        // 4、如果该函数没有返回对象，则返回this
        return result instanceof Object ? result : obj;
    }
```

可以看到，优化后的代码更加的简洁、高效。
