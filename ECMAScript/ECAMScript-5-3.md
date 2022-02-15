### 原型和原型链

- - -

#### 构造函数
##### 什么是构造函数
constructor 返回创建实例对象时构造函数的引用。此属性的值是对函数的本身的引用，而不是一个包含函数名称的字符串。
```
function Person(name, age) {
    this.name = name;
    this.age = age;
}

p = new Person('zhang san', 18)
console.log(p.constructor === Person); // true
console.log(p.constructor === Object); // false
```
构造函数本身就是一个函数，和普通函数没有任何区别，不过为了规范一般将首字母大写。
构造函数和普通函数的区别在于：使用new 生成实例的函数就是构造函数，直接调用的就是普通函数。
那这样是不是意味着普通的函数创建的实例没有 constructor 属性呢？ 不一定。
```
function score() {
    return {
        name: 'lisi'
    }
}

var s = score()
console.log(s.constructor === Object);
```
#### Symbol 是构造函数吗
Symbol 是基本数据类型，但是作为构造函数来说它并不完整，因为它不支持语法new Symbol(),Chrome 认为其不是构造函数，如果要生成实例直接使用 Symbol（）即可。
```
console.log(new Symbol(123)); // Symbol is not a constructor
console.log(Symbol(123)); // Symbol(123)
```
虽然 Symbol是基本数据类型，但是Symbol(123)实例可以获取constructor属性值。
```
var s = Symbol(123)
console.log(s.constructor); // f Symbol(){ [native code] }
```
这里的 constructor 属性来自哪里？ 其实是 Symbol 原型上的，即Symbol.prototype.constructor 返回创建实例原型的函数，默认为 Symbol 函数。

#### constructor值只读吗
这个要分情况来看的，对于引用类型来讲 constructor 属性值是可以修改的，但是对u基本类型来说是只读的。
引用类型中constructor值可以修改，比如在原型链继承方案中，需要对constructor重新赋值进行修改。
```
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype = {
    method: function () { }
};

function Teacher() {
}

Teacher.prototype = new Person('zhang san', 19)
Teacher.prototype.fs = 'Hello Person';

console.log(Teacher.prototype.constructor === Object); // true

Teacher.prototype.constructor = Person;

console.log(Teacher.prototype); // {name: "zhang san", age: 19, fs: "Hello Person", constructor: ƒ}
var t = new Teacher('zhang san', 10)
console.log(t); // Teacher {}
console.log(t.name); // zhang san
console.log(t.age); // 19
```
对于基本类型来说 constructor 是只读的 如 1、‘hello world’、true、Symbol 当然 null 和 undefined 是没有 constructor 属性的。
```
function Type() { };
var	types = [1, "hello world", true, Symbol(11)];

for(var i = 0; i < types.length; i++) {
	types[i].constructor = Type;
	types[i] = [ types[i].constructor, types[i] instanceof Type, types[i].toString() ];
};

console.log( types.join("\n") );
// function Number() { [native code] }, false, 1
// function String() { [native code] }, false, muyiy
// function Boolean() { [native code] }, false, true
// function Symbol() { [native code] }, false, Symbol(123)
```
为什么呢？ 因为创建他们的是只读的原生构造函数(native constructors), 这个例子也说明了依赖一个对象的 constructor 属性并不安全。
 
#### 模拟new的实现
```
function myNEW() {
    // 1、创建一个空对象
    var obj = Object.create(null)
    // 2、拿到我们的构造函数并删除arguments中的第一项
    var handler = Array.prototype.shift.call(arguments)
    // 3、链接到原型，obj可以访问构造函数原型中的属性
    Object.setPrototypeOf(obj, handler.prototype)
    // 4、绑定 this 实现继承，obj可以访问到构造函数中的属性
    var ret = handler.apply(obj, arguments)
    // 5、优先返回构造函数中的返回的对象
    return ret instanceof Object ? ret : obj
}

function Person(name, age) {
    this.name = name;
    this.age = age;
}

console.log(myNEW(Person, 'zhang san', 19));
console.log(new Person('zhang san', 19));
```

#### prototype
Javascript 是一种基于原型的语言（prototype-based language），这个和 Java 等基于类的语言不同。

每个对象拥有一个**原型对象**，对象以其原型为模板，从原型继承方法和属性，这些属性和方法定义在对象的构造器函数的 prototype 属性上，而非对象实例本身。
```
function Person(name, age) {
    this.name = name;
    this.age = age;
}

var person = new Person('zhang san', 18)
console.dir(Person)

console.log(Person.prototype.constructor === Person);

console.log(Person.prototype);

// 打印结果如下
    ƒ Person(name, age)
      arguments: null
      caller: null
      length: 2
      name: "Person"
      prototype:
          constructor: ƒ Person(name, age)
          __proto__: Object
      __proto__: ƒ ()

// 2
    {constructor: ƒ}
      constructor: ƒ Person(name, age)
      __proto__: Object
      
// 3
    true
```
我们写了一个构造函数，然后通过 console.dir 打印出了 Person
通过执行结果 我们可以看到 构造函数Person 有一个原型对象 prototype， 其上有两个属性，分别是 constructor 和 __proto__

构造函数Person 有一个指向原型的指针（Person.prototype），原型 Person.prototype 有一个指向构造函数的指针，通过上面的代码我们会发现，这是一个循环引用。

#### __proto__
上面代码可以看到 Person 原型(Person.prototype) 上有 __proto__ 属性， 这个是一个访问器属性(即 getter 函数 和 setter 函数),
通过它可以访问到对象的内部[[Prototype]]   这个[[Prototype]]可以是一个对象 也可能是 null。  对象 或 null。

__proto__ 发音 (dunder proto),最先被 Firefox 使用，后来在 ES6 被列为 Javascript 的标准内建属性。

[[Prototype]] 是对象的一个内部属性，外部代码无法直接访问。 --》 遵循 ECMAScript 标准，someObject.[[Prototype]] 符号用于指向 someObject 的原型。
__proto__ dunder proto 是每个实例上都会有的属性， 但是 prototype 是构造函数的属性， 这两个并不相同，但是他们指向同一个对象。
```
function Person(name, age) {
    this.name = name;
    this.age = age;
}

var person = new Person('zhang san', 18)

console.log(person.__proto__ === Person.prototype); // true
```
这里获取 person 的对象的原型 与 Person 的原型对象进行比较

**那么 构造函数、实例对象、对象原型之间的关系：**  
首先构造函数的 dunder proto（__proto__）指向的是 对象原型 [CONSTRUCTOR -- 构造函数 ].prototype ,然后对象原型中有属性 constructor 指向构造函数，然后构造函数的 prototype 指向对象原型。
由于工作环境无法上传图片 就给各位老板手绘一波关系图
```
                     .__proto__                                       .constructor
    实例 person   ---------------- >    对象原型 Person.prototype   --------------------- >  构造函数 - Person 
                                                   ^                                                |
                                                   |________________________________________________|
                                                                       .prototype
```
**注意：** 
__proto__ 属性在 ES6 时才被标准化，以确保 Web 浏览器的兼容性，但是不推荐使用，除了标准化的原因之外还有性能问题。为了更好的支持，推荐使用 Object.getPrototypeOf().
```
    通过改变一个对象的 [[Prototype]] 属性来改变和继承属性会对性能造成非常严重的影响，并且性能消耗的时间也不是简单的花费在 obj.__proto__ = ... 语句上, 它还会影响到所有继承自该 [[Prototype]] 的对象，如果你关心性能，你就不应该修改一个对象的 [[Prototype]]。
```
如果要读取或修改对象的 [[Prototype]] 属性，建议使用如下方案，但是此时设置对象的 [[Prototype]] 依旧是一个缓慢的操作，如果性能是一个问题，就要避免这种操作。
```
var obj = {
    name: 'Person',
    age: 18
}

var teacher = {
    type: 'teacher',
    gender: 'man'
}

Object.setPrototypeOf(obj, teacher)
console.log(obj);
console.log(Object.getPrototypeOf(obj));
```
如果要创建一个新对象，同时继承另一个对象的[[Prototype]],推荐使用 Object.create().
```
var teacher = {
    type: 'teacher',
    gender: 'man'
}
var s = Object.create(teacher)
console.log(s);
```
**优化 new 的实现**  
正如上面介绍的不建议使用 __proto__ 修改原型，所以我们使用 Object.create() 来实现
我们只需要把之前 链接原型 和创建空对象 放在一起进行 使对象直接继承我们构造函数的原型。
如下：
```
	function myNEW() {
	    var handler = Array.prototype.shift.call(arguments);
	    var obj = Object.create(handler.prototype);
	    var ret = handler.apply(obj, arguments)
	    return ret instanceof Object ? ret : obj
	}
```

#### 原型链
每个对象都拥有一个原型对象，通过 __proto__ 指向上一个原型，并从中继承方法和属性， 同时原型对象也可能拥有原型，这样一层一层，最终指向 null。这种关系被称为原型链（prototype chain），
通过原型链，一个对象会拥有定义在其他对象中的属性和方法。
```
function Person(name) {
    this.name = name;
}

var p = new Person('zhang san');

console.log(p.constructor === Person); // true
```
这段代码打印出的结果是 true 是意味着 实例中存在 constructor 属性指向构造函数吗？
当然不是 我们之前打印除了 实例的结构 发现  实例 p 本身没有 constructor，是通过原型链向上查找 __proto__，最终找到 constructor 属性，该属性指向 Person。
于是 我们的原型链 如下：
```
function Person(name) {
    this.name = name;
}

var p = new Person('zhang san');

console.log(p.__proto__ === Person.prototype);
console.log(p.__proto__.__proto__ === Object.prototype);
console.log(p.__proto__.__proto__.__proto__ === null);
```
__proto__属性指向的是上一个原型，也就是说 我们一直在取上一个原型，只要我们的取出来的不是null （最顶层的原型）

#### 小结
+ Symbol 作为构造函数来说并不完整，因为不支持语法 new Symbol()，但其原型上拥有 constructor 属性，即 Symbol.prototype.constructor。
+ 引用类型 constructor 属性值是可以修改的， 但是对于基本类型来说是只读的， null 和 undefined 没有 constructor 属性。
+ __proto__ 是每个实例上都有的属性， prototype 是构造函数的属性，这两个并不一样，但 p.__proto__ 和 Person.prototype 指向同一个对象。
+ __proto__ 属性在 ES6 时被标准化，但因为性能问题并不推荐使用，推荐使用Object.getPrototypeOf（）
+ 每个对象拥有一个原型对象，通过 __proto__ 指针指向上一个原型，并从中继承方法和属性，同时原型对象也可能拥有原型，这样一层一层，最终指向null，这就是原型链。 

- - -















































