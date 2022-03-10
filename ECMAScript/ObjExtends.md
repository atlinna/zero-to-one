# 对象继承方案

### 1、原型链继承
构造函数、实例对象和原型之间的关系：每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，每个实例都有一个原型对象的指针
继承的本质就是 通过父类的实例来重写子构造函数的原型对象。
```
function Person() {
  this.name = 'lisa';
}

function Chinese() {
  this.color = 'yellow';
}
Chinese.prototype = new Person()
Chinese.prototype.constructor = Chinese



var c = new Chinese()
console.log(c);
```
存在的缺点：多个实例对引用类型的数据操作冲突
```
function Person() {
  this.hobbies = ['football', 'basketball', 'baseball'];
}

function Son() {

}

Son.prototype = new Person();
Son.prototype.constructor = Son;

var s = new Son();
var c = new Son();

console.log(s.hobbies);  // ["football", "basketball", "baseball"]
s.hobbies.pop();
console.log(c.hobbies);  // ["football", "basketball"]
```

### 2、借用构造函数继承
使用父类的构造函数来增强字类实例，等同于复制弗雷的实例给字类
```
function Person() {
  this.hobbies = ['football', 'basketball', 'baseball'];
}

function Son() {
  Person.call(this)
}

var s = new Son();
var c = new Son();

console.log(s, c);
s.hobbies.pop();
console.log(s.hobbies);  // ["football", "basketball"]
console.log(c.hobbies);  // ["football", "basketball", "baseball"]
```
核心代码是 Person.call(this)  new 关键字已经将 this 绑定为新创建的对象 这个时候 我们调用 父类构造函数并将 this 指向我们字类创建的对象 为 子对象添加属性（相当于复制属性）变相的把父类属性复制到子实例中
这样存在缺点：
+ 只能继承父类的实例属性和方法，不能继承父类的原型。也就是说没有父类原型的属性和方法。
+ 无法实现复用，每个字类都会从父类那里复制，影响性能。

### 3、组合继承
组合上述两种方法就是组合继承。用原型链实现对原型属性和方法的继承，用借用构造函数计数来来实现实例属性的继承。
```
function Person() {
  this.hobbies = ['football', 'basketball', 'baseball']
}

function Son(age) {
  Person.call(this)
  this.age = age;
}

Son.prototype = new Person()
Son.prototype.constructor = Son;


var s = new Son(1)
var c = new Son(2)
c.hobbies.pop()
console.log(s); //
console.log(c); //
```
缺点：
+ 第一次调用 Person 是为了修改 Son 的原型 调用后 给原型添加了 一个属性 hobbies
+ 第二次调用 Person 是创建实例 s 调用后 给实例 s 添加了 属性 hobbies
实例对象 s 上的 hobbies 属性屏蔽了其原型对象上（Son.prototype）上的同名属性。
所以，组合模式的缺点就是在使用字类创建实例对象时，其原型中会存在两份相同的属性/方法。


### 4、原型式继承
本质就是利用一个空对象作为中介，将某个对象直接复制给**空对象构造函数的原型**
```
function object(obj) {
  function F() { }
  F.prototype = obj
  return new F()
}

console.log(object({ name: 'zhang san', age: 18 }));
```
object 对传入其中的函数执行了一次**浅复制**，将构造函数 F 的原型直接指向传入对象
缺点：
+ 同原型链继承相同，存在对引用类型数据的篡改。
+ 不能传入参数。

### 5、寄生式继承
核心：在原型式继承的基础上，增强对象，返回构造函数
```
function object(obj) {
  function F() { }
  F.prototype = obj
  return new F()
}

function createPalace(origin) {
  var clone = object(origin)
  console.log(clone);
  clone.sayHello = function () {
    console.log(this.name);
  }
  return clone
}


p = createPalace({ name: 'zhang san' })
p.sayHello() // zhang san
```
函数的作用主要是用来为构造函数新增属性，和方法，来增强函数
缺点（同原型式继承）：
+ 同原型链继承相同，存在对引用类型数据的篡改。
+ 不能传入参数。

### 寄生组合式继承
结合借用构造函数传递参数和寄生模式实现继承
```
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayName = function () {
  console.log('My name is ' + this.name);
}

function Son(name, age, sex) {
  Person.call(this, name, age);
  this.sex = sex;
}

// ---------------------这--是--一--条--分--隔--线--------------------------------------------

function inheritPrototype(subType, superType) {
  var prototype = Object.create(superType.prototype) // 创建一个继承自父类型的空对象
  prototype.constructor = subType; // 让 constructor 指向要继承的构造函数（子类型）
  subType.prototype = prototype; // 让子类型的原型对象指向空对象 完成继承
}

inheritPrototype(Son, Person)

Son.prototype.sayAge = function () {
  console.log('I am ' + this.age + ' years old');
}

var p1 = new Son('zhang san', 18, '男')
var p2 = new Son('xiao hong', 19, '女')


```
可能有的人觉得这个例子有点长，我们分开来看，代码上有一条分割线，我们先看上半部分
首先定义了一个父类的构造函数 Person 接受两个参数 name、age 然后再原型又定义了一个方法 sayName 只要字类继承我们就能拿到父类中的属性和方法对吧， 然后定义了一个字类的构造函数 Son 我们发现 Son 继承的方式是借用构造函数的方式对吧。
然后我们来到下半部分， 一个函数 inheritPrototype 他接受两个参数 一个 subType 一个 superType 父子类型的构造函数，这里又使用了寄生式的继承方案替换了 子构造函数的 prototype
这样做的好处是 
**因为只调用一次 父类构造函数，并且因此避免了在子类型的原型（Son.prototype）上创建不必要、多余的属性。同时还能保持原型链不变；因此能够正常使用 instanceof 和 isPrototypeOf()**

这是最成熟的方法，也是现在库实现的方法


### 混入方式继承多个对象
```
function Person(name) {
  this.name = name;
}

function Action(type) {
  this.type = type;
}

function School(level) {
  this.level = level;
}

function Son(name, type, level, sex) {
  Person.call(this, name)
  Action.call(this, type)
  School.call(this, level)
  this.sex = sex;
}

Son.prototype = Object.create(Person.prototype);
Object.assign(Son.prototype, Action.prototype, School.prototype)
Son.prototype.constructor = Son;


var s = new Son('zhang san', 'Chinese', 6, '男')
console.log(s);
```


### ES6 类继承 extends
extends 关键字主要用于类声明或者类表达式中，以创建一个类，该类是另一个类的字类。其中 constructor 表示构造函数，一个类中只能有一个构造函数，有多个会报出 SyntaxError 错误，如果没有显式指定构造方法，则会添加默认的 constructor 方法。
```
class Animal {
  constructor(name, weight) {
    this.name = name;
    this.weight = weight;
  }

  sayHello() {
    console.log('hello My Name is ' + this.name)
  }
}

var a = new Animal('Tony', 100)

class Tiger extends Animal {
  constructor(name, weight, skill) {
    super(name, weight) // !-1
    this.skill = skill;
  }

  get skills() {
    return this.skill.join(',')
  }
}

var t = new Tiger('Tips', 100, ['bite', 'run', 'power'])
```
如果子类中存在构造函数，则需要在使用 this 前首先调用一下 super()。

extends 继承的核心代码如下，其实现和寄生组合式继承相同
```
function _inherits(subType, superType) {
  // 创建对象，创建父类原型的一个副本
  // 增强对象，弥补因重写原型而失去的默认的 constructor 属性
  // 指定对象，将新创建的对象赋值给子类型的原型
  subType.prototype = Object.create(superType && superType.prototype, {
    constructor: {
      value: subType,
      enumerable: false,
      writable: true,
      configurable: true
    }
  })

  if (superType) {
    Object.setPrototypeOf ? Object.setPrototypeOf(subType, superType) : subType.__proto__ = superType;
  }

}
```

## 总结

### 1、函数声明和类声明的区别
函数声明会提升，类声明不会。首先需要你声明一个类，然后再去调用执行这个类，不然就会 ReferenceError。
```
let p = new Person()

class Person{}
```

### 2、Es6 与 Es5 之间继承的区别
+ Es5的继承本质就是创建出子类实例的对象，然后将父类的方法添加到 this 上（Parent.call(this)）
+ Es6的继承实际上是先创建父类的实例对象 this，然后再用字类的构造函数修改 this。因为字类没有自己的 this 对象，所以必须在使用 this 前 先调用 super 方法，不然会报错。





















