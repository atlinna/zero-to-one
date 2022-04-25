### isArray

#### 描述：
Array.isArray() 用于确定传递的值是否是一个 Array。

**参数**
obj:需要检测的值。

**返回值**
如果值是 Array，则为true; 否则为false。


### 代码实现：
```
  function my_IsArray(target){
    return Object.prototype.toString.call(target) === '[object Array]'
  }
```
