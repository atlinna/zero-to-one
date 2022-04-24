## instanceof

#### 描述：
instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

#### 代码实现：
```
    /**
     * 
     * @param {原} origin 
     * @param {目标} target 
     */
    function myInstance(origin,target){
        if(typeof target !== 'object') throw new TypeError(target + ' is not a object')
        cur = origin
        while(cur){
            if(cur === target.prototype){
                return true
            }
            cur = Object.getPrototypeOf(cur)
            // cur = cur.__proto__
        }
        return false
    }
```

我们只需要向上查找 源的原型链。
这里我们使用 Object.getPrototypeOf 来获取源的原型，而不是直接读取 __proto__ 属性。
