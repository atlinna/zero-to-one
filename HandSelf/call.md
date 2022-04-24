## call

### 描述：
**参数**：
+ thisArg
  **可选的。在 function 函数运行时使用的 this 值。请注意，this可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动替换为指向全局对象，原始值会被包装。**

call() 允许为不同的对象分配和调用属于一个对象的函数/方法。

call() 提供新的 this 值给当前调用的函数/方法。你可以使用 call 来实现继承：写一个方法，然后让另外一个新的对象来继承它（而不是在新对象中再写一次这个方法）。

### 分析：
call 方法实现的难点在于，我们如何去改变一个函数中的 this 。
是否还记得，在一个对象中，如果我们调用这个对象的函数，其中的 this 是什么？ 是不是调用者也就是这个对象？
我们需要给传入的对象添加一个属性，这个属性指向我们函数本身，然后通过对象调用这个函数，完成 this 指向的改变。
最后只需要删除这个属性。

### 代码实现：
```
    function myCall(...args) {
        if(thisArgs == null) return this()
        thisArgs.handler = this;
        let ret = thisArgs.handler(...args)
        delete thisArgs.handler;
        return ret
    }

    Function.prototype.myCall = myCall;
```
