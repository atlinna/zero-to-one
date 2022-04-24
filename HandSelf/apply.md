## apply

### 描述
apply() 方法调用一个具有给定this值的函数，以及以一个数组（或类数组对象）的形式提供的参数。

func.apply(thisArg, [argsArray])

**参数**：
+ thisArg
  **必选的。在 func 函数运行时使用的 this 值。请注意，this可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动替换为指向全局对象，原始值会被包装。**
+ argsArray
  **可选的。一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 func 函数。如果该参数的值为 null 或  undefined，则表示不需要传入任何参数。从ECMAScript 5 开始可以使用类数组对象。浏览器兼容性 请参阅本文底部内容。**
  
 我们实现了 call ，apply 与 call 及其相似，只不过 call 和 apply 传参的不通而已。
 
 ### 代码实现：
 ```
     function myApply(thisArg,argsArray){
        if(thisArg == null) return this()
        let args = argsArray || [];
        thisArg.handler = this
        let ret = thisArg.handler(...args)
        delete thisArg.handler;
        return ret
    }

    Function.prototype.myApply = myApply;
 ```
