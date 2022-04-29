### Object.create

#### 描述
**参数**
+ proto:新创建的原型对象
+ propertiesObject：选。需要传入一个对象，该对象的属性类型参照Object.defineProperties()的第二个参数。
  如果该参数被指定且不为 undefined，该传入对象的自有可枚举属性(即其自身定义的属性，
  而不是其原型链上的枚举属性)将为新创建的对象添加指定的属性值和对应的属性描述符。

#### 代码实现
```
    Object.myCreate = function (proto, propertiesObject) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        }
        
        if(propertiesObject && typeof propertiesObject !== 'object'){
            throw new TypeError(propertiesObject +'must be a object')
        }
          
        function F() { }
        F.prototype = proto;

        let f = new F()
        if (propertiesObject) {
            Object.defineProperties(f, propertiesObject)
        }

        if (proto === null) {
            Object.setPrototypeOf(f, null)
        }

        return f;
    };
```

Object.create 其实就是继承的一种方式。
