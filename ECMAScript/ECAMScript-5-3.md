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
**注意：对象是通过 __proto__ 指向上一个原型，并继承方法和属性** 
用到的是继承而不是复制
```
function Person(name) {
    this.name = name;
}

Person.prototype.length = 101;

var p = new Person('zhang san');
console.log(p.__proto__);
```
我们会发现 结果中存在 length 属性。

**原型上的属性和方法定义在 prototype 对象上，而非对象实例本身/当访问一个对象的属性/方法时,它不仅仅在该对象上查找，还会查找该对象的原型，以及该对象的原型的原型，一层一层往上找，
直到找到一个名字匹配的属性/方法或者到达原型的最顶层 null 。**


思考如果调用 person.valueOf() 会发生什么？
+ 首先会检查 person 对象上是否具有可用的 valueOf 方法。
+ 如果没有，则会向上查找 person 对象的原型对象 (person.__proto__ 即 Person.prototype) 是否具有可用的 valueOf 方法。
+ 如果没有，则继续向上查找 person 的原型对象的原型对象 (person.__proto__.__proto__ 即 Object.prototype) 看是否存在可用的 valueOf 方法。此时找到了 valueOf 方法执行
```
function Person(name) {
    this.name = name;
}


var p = new Person('zhang san');
console.log(p.valueOf(),p);
```

#### prototype 和 __proto__
区别：
原型对象 prototype 是构造函数上的属性， __proto__ 是每个实例上都有的属性，两个属性不同但是指向的是同一个对象。


那么原型链的构建是依赖于 prototype 还是 __proto__ 呢？
[如图](https://camo.githubusercontent.com/20b790bd15137b6aa77ddc1ce17a60ed2a772d8807cc6886dd1e2185052d7d75/68747470733a2f2f322e62702e626c6f6773706f742e636f6d2f2d3269694c57367774454f302f55477444582d5a505f6f492f41414141414141414166512f46705346434567316b37512f73313630302f4a6176617363726970742b50726f746f747970616c2b496e6865726974616e63652b4469616772616d2b2d2b6772616e642b706963747572652b2833292e706e67) 
如上图所示，我们会发现在原型链中 Foo.prototype 中的 prototype 并没有狗哼一条原型链，它只是指向了原型链中的某一处位置。 原型链的构建依赖于 __proto__， 如上图中 foo.__proto__ 指向 Foo.prototype ， foo.__proto__.__proto__ 指向 Bichon.prototype 如此一层一层最终链接到 null 。

**注意： 不要使用 Bar.prototype = Foo ,因为这不会执行 Foo 的原型，而是指向函数 Foo ，因此原型链将会链接到 Function.prototype 而不是 Foo.prototype ,因此 methods 方法不会再 Bar
 的原型链上。**
```
function Foo() {
    return 'foo'
}

Foo.prototype.methods = function () {
    return 'method'
}

function Bar() {
    return 'bar'
}

Bar.prototype = Foo
let bar = new Bar()
console.log(bar);
```

#### instanceOf 的原理
instanceOf 运算符用来检测 constructor.prototype 是否在参数的原型链上
```
function Person() {

}

function People() {

}

var p = new Person()

console.log(p instanceof Person); // true   Object.getPrototypeOf(p) === Person.prototype
console.log(p instanceof People); // false
console.log(Object.getPrototypeOf(p) === Person.prototype);
```
**instanceOf原理就是:一层一层查找 __proto__，如果和 constructor.prototype 相等 则返回 true ，如果一直没有查找成功则返回 false**  
```
  instance.[__proto__...] === instance.constructor.prototype
```
那么我们知道了原理就来浅试一下 实现 instanceOf：
```
function myInstanceOf(A, B) {
    var target = B.prototype;
    while (A.__proto__) {
        if (A.__proto__ === target) {
            return true;
        }
        A = A.__proto__;
    }
    return false;
}

function Person() {

}

function People() {

}

var p = new Person();

console.log(p instanceof Person); // true   Object.getPrototypeOf(p) === Person.prototype
console.log(p instanceof People); // false
console.log(Object.getPrototypeOf(p) === Person.prototype);


console.log(myInstanceOf(p, Person));  // true
console.log(myInstanceOf(p, People));  // false
```

#### 原型链继承
原型链继承的本质就是重写原型对象，用一个新的要继承的实例来替代。 新的原型 Solder 不仅有 new Person() 实例上的全部属性和方法，并且由于指向了 Person 原型，所以还拥有 Person 原型上的所有方法和属性。
```
function Person() {
    this.name = 'zhang san';
}

Person.prototype.run = function () {
    console.log(this.name + ' is running!');
}

function Solder() {

}


Solder.prototype = new Person()
var s = new Solder()
console.log(s);
s.name = 'li si'
s.run()
```

原型链继承方案有以下缺点：
+ 多个实例对引用类型的操作会被篡改
+ 子类型的原型上的 constructor 属性被重写了
+ 给子类型原型添加属性和方法必须在替换原型之后
+ 创建子类型实例时无法向父类型的构造函数传参

** 一**  
我们先来看第一个
在原型链继承方案中，我们的原型会变成另一个类型的实例，如下数代码， Solder.prototype 变成了 Person 的一个实例，所以 Person的实例属性 hobbies 就变成了 Solder 的属性。

在原型属性上的引用类型数据会被所有的实例共享，每个实例都能对其进行修改，所以多个实例对引用类型的操作会篡改原数据，如下 我们修改了 s1 实例中的实例属性后，影响到了 s2 中实例属性的值。
```
function Person() {
    this.hobbies = ['football', 'basketball', 'swimming'];
}

Person.prototype.run = function () {
    console.log(this.name + ' is running!');
}

function Solder() {

}


Solder.prototype = new Person()
var s1 = new Solder()
var s2 = new Solder()
console.log(s1.hobbies, s2.hobbies);
s1.hobbies.shift()
console.log(s1.hobbies, s2.hobbies);
```

** 二**  
首先看下面代码
```
function Person() {
    this.hobbies = ['football', 'basketball', 'swimming'];
}

Person.prototype.run = function () {
    console.log(this.name + ' is running!');
}

function Solder() {

}


Solder.prototype = new Person()
var p = new Solder()
console.log(p.constructor);

/
*ƒ Person() {
    this.hobbies = ['football', 'basketball', 'swimming'];
}
*/
```
观察打印结果 我们发现通过 new Solder() 出的实例的构造函数，不是 Solder 而是 Person
因为这个 Solder 的 原型对象指向的是 Person 的实例 这个实例的构造函数 constructor 是 Person
解决方法就是 重写 我们这个 Solder 的 constructor 让他指向 Solder
```
function Person() {
    this.hobbies = ['football', 'basketball', 'swimming'];
}

Person.prototype.run = function () {
    console.log(this.name + ' is running!');
}

function Solder() {

}


Solder.prototype = new Person()
Solder.prototype.constructor = Solder;  // 新增代码 将 Solder 原型对象的 constructor 指向自己的构造函数 Solder
var p = new Solder()
console.log(p.constructor);
/*
ƒ Solder() {

}
*/
```

** 三**  
给子类型原型添加属性和方法要在替换原型之后，因为我们会替换子类型的原型 替换之后指向了 Person 的 实例。
```
function Person() {
    this.hobbies = ['football', 'basketball', 'swimming'];
}

Person.prototype.say = function () {
    return this.hobbies.join(' ') // 修改方法
}

function Solder() {

}


Solder.prototype = new Person()
Solder.prototype.constructor = Solder;

Solder.prototype.say = function () {
    return this.hobbies.join(','); // 新增方法
}

var p = new Solder()
console.log(p.say());
```
我们会发现，现在实例能访问两个 say 方法 ，但是 实际上运行的是我们新增在 Solder 原型对象上的 say 方法 而 Person.prototype 上也有一个 say 方法，但是它不会访问到。这种情况称为 属性遮蔽。
如果我们要访问 Person 上的 say 方法要如何操作？ 通过 __proto__  // console.log(p.__proto__.__proto__.say);

#### 其他继承方案
由于 ES6 封装了 class 日常工作中我们使用 ES6 Class Extends (模拟原型)继承方案即可，更多可阅读 木易杨大神的 [Javascript 8种继承方案](https://github.com/yygmind/blog/issues/7)


#### 练习：
有三个判断数组的方法，请分别介绍他们之间的区别和优劣
+ Object.prototype.toString.call()
+ instanceOf
+ Array.isArray()



#### 小结
+ 每个对象拥有一个原型对象，通过 __proto__ 指向上一个原型，并从中继承方法和属性，同时原型对象也可能拥有原型，这样一层一层，最终指向 null，这种关系被称为 **原型链**  
+ 当访问一个对象的属性或方法时，它不止在对象本身查找，还会查找该对象的原型，如果对象的原型也有原型，还会再该对象的原型的原型，一层一层，向上查找，直到找到名称完全匹配的属性或方法，或到达原型链的顶层 null 。
+ 原型链的构建依赖于 __proto__,一层一层最终链接到null。
+ instanceOf 的原理就是一层一层查找 __proto__，如果和 constructor.prototype 相等则返回 true ，如果一直没有查找成功，则返回 false
+ 原型链继承的本质就是重写原型对象，用一个新类型的实例来代替。























