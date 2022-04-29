## Object.assign

### 描述
参数：
+ target：要合并到的对象 -- 》 这个地方 是将其他对象的属性合并到这个对象身上 别搞错了。
+ ...args：其他对象，指要与 target 对象 合并的 一个或多个对象。

### 代码实现
```
    Object.myAssign = function () {
        let target = Array.prototype.shift.call(arguments)
        let originSource = Array.prototype.slice.call(arguments)
        if (target === null || target === undefined) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        for (let i = 0; i < originSource.length; i++) {
            for (let key in originSource[i]) {
                if (Object.prototype.hasOwnProperty.call(originSource[i], key)) {
                    target[key] = originSource[i][key];
                }
            }
        }
        return target
    }
```

Object.hasOwnProperty 目的是判断对象中是否存在某个属性。
