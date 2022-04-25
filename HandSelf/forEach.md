### forEach

#### 描述：
forEach() 方法对数组的每个元素执行一次给定的函数。

它的表现形式呢（调用形式）
arr.forEach(callback(currentValue [, index [, array]])[, thisArg])

**参数**
+ callback：为数组中每个元素执行的函数，该函数接收一至三个参数：
    + currentValue：数组中正在处理的当前元素。
    + index:数组中正在处理的当前元素的索引。
    + array:forEach() 方法正在操作的数组。
+ thisArg：可选参数。当执行回调函数 callback 时，用作 this 的值。

#### 代码实现：
```
    Array.prototype.myForEach = function (callback, thisArg) {
        var T, k;

        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }

        // 1. Let O be the result of calling toObject() passing the
        // |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get() internal
        // method of O with the argument "length".
        // 3. Let len be toUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If isCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let
        // T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {
            var kValue;
            // a. Let Pk be ToString(k).
            //    This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty
            //    internal method of O with argument Pk.
            //    This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {
                // i. Let kValue be the result of calling the Get internal
                // method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as
                // the this value and argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };

    Array.prototype.myForEach.call('abcde', item => {
        console.log(item);
    })
```

#### 分析：
1、
```
    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);
```
首先，看上面这行代码，这个是做什么用的？

2、
```
    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;
```
这行代码又做了些什么呢？

先看第一个问题
**-1-**
理想状态下我们使用数组调用， this 自然指向的是我们的数组，但是如果使用 call 或 apply 的方式使用其他的数据类型来掉用 forEach 方法，那是不是就出现问题了？ 使用 Object(this) 的原因就是把我们的数据包装成一个对象。
但是我们自己尝试的时候发现，不管我用的是不是一个对象，最后打印出来，就是一个对象类型的数据。这是因为，非严格模式下，改变 this 指向，this 都会被包装成一个对象，但在严格模式下不会。
这个的作用就是处理传入的数据非数组的情况。


**-2-**
这个的作用就是防止你的length属性是 null 或 undefined 。
