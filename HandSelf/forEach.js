###forEach

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
