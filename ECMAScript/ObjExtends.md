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
