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

### 5、寄生式继承































