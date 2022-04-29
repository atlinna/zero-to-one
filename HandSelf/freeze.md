## Object.freeze

### 描述
Object.freeze 可以冻结一个对象使其不能新增、删除属性，其下的属性也无法修改。

freeze 的实现由两部分组成
+ Object.seal() 作用是让对象无法扩展、删除属性。
+ Object.defineProperty() 作用是通过配置对象使属性无法修改。

简单来说就是这个对象变为了只读。

### 代码实现
```
    function freeze(target) {
        if (target && target instanceof Object) {
            Object.seal(target);
            for (let key in target) {
                if (Object.prototype.hasOwnProperty(target, key)) {
                    Object.defineProperty(target, key, {
                        writable: false
                    })
                    if (target[key] instanceof Object) freeze(target[key])
                }
            }
        }
        return target
    }
```
