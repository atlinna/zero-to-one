# 设计模式-单例模式

单例模式属于创造类型的模式，研究的是对象的创建。

定义：

保证一个类仅有一个实例，并提供一个访问他的全局访问点。

顾名思义，是一个仅需要实例化一次的构造函数。

如果你是进行一个小型的网页开发，多创建一个两个的对象，对性能的消耗根本就是那种无关紧要的对吧，一两个对象才消耗多少性能。这种情况不适合。

如果是一种大型的站点，比方说 wechat，假设现在有一个用户，用户需要登录，并且要保证他在一定事件内登录有效。

你说这种登录功能，你能多次登录吗？这种要求是不是仅需要实例化一次就足以了

假设我们现在要开发一款贪吃蛇的游戏对吧，当你的蛇吃到小点点，会变大。但是，贪吃蛇这个本体，是不是也仅需要在开始游戏的时候实例化一次啊？



接下来我们看看如何创建一个单例模式。

### 单例模式的创建

我们的单例模式的原则是什么？

**一个构造函数有且仅能创建一个实例。**

假设我们有两个变量 a、b ，我们的 a 通过 new 实例化可以得到一个实例，然后 b 通过同样的操作也能得到一个实例，且 a === b

+ 第一种实现方式

  首先我们回顾一下 new 操作符对构造函数进行了哪些操作？ 或者说 new 操作符做了什么事？

  ```
  function Person(name){
  	// 创建了一个对象，然后对象继承构造函数的原型，
  	// 改变 this 到这个对象，为对象添加属性。
  	// 实际上是不是下面的这行代码，
  	// this = Object.create(Person.prototype)
  	.
  	.
  	.
  	// 最后 如果没有对象返回就返回 this 
  	// return this
  }
  ```

  也就是说我们的实现其实只是填充中间那部分对吧？ 其他的操作已经通过new 操作符隐式的完成了。

  Ok 那我们来吧！

  我们如果想让一个构造函数返回的是相同的实例。

  是不是最后 return 的 this 必须是相同的，也就是说我们需要一个地方来存放我们首次创建的 this。

  ```
  			// 实现方式 1
          function Person(name) {
              if (Person.self) {
                  return Person.self
              }
              Person.self = this;
              this.name = name;
          }
  
          var a = new Person('zhang san');
          var b = new Person('');
          console.log(a === b); // true
  ```

  但是这种方式不好，为什么说他不好呢？

  他违反了我们设计模式六大原则中的开闭原则。因为他将这个实例完全的暴露出来。

  ```
  				var a = new Person('zhang san');
          Person.self = {};
          var b = new Person('');
          console.log(a === b);
  ```

  如上，我将 Person 的 self 属性重新赋值为一个空对象 {} 那么当你第二次进行实例化的时候，返回的 是 {} 而不是首次实例化的 this

+ 第二种实现方式

  使用闭包的方式，保存一个变量。

  ```
          // 实现方式 2
          function Person(name) {
              var self = this;
              this.name = name;
              Person =  function (){
                  return self
              }
          }
  
          var a = new Person('zhang san');
          var b = new Person();
          console.log(a === b);
  ```

  这种方式其实也不是很好，为什么这么说呢？

  比方说我们除了用到这个实例，还想用到他的原型链。

  ```
          // 实现方式 2
          function Person(name) {
              var self = this;
              this.name = name;
              Person = function () {
                  return self
              }
          }
  
          var a = new Person('zhang san');
          Person.prototype.id = '10010';
          var b = new Person();
          console.log(a === b, a.id, b.id); // true undefined undefined
  ```

  我们在实例化 a 后保存了 一个 ID 到 他的原型链上。但是我们发现 诶 ，在 a，b 上根本取不到这个值。

  这是为什么呢？

  因为我们在首次实例化后，由于 self 保存了 我们的实例，Person 重新赋值 成为了新的函数，也就是 那个匿名函数，然后当我们给 Person 的原型链添加属性的时候，实际上添加的是匿名函数的原型。而不是我们的 原Person函数（构造出实例的那个函数）

  所以这个方案，我们也 pass 掉。

+ 第三种实现方式

  这次我们通过一个立即执行函数来保存实例

  ```
          var Person = (function () {
              return ...
          })()
  ```

  我们 变量 Person 的内容是不是就是 这个立即执行函数返回的内容

  ```
          // 实现方式 3
          var Person = (function () {
              var self = null;
              return function (name) {
                  if (self) {
                      return self;
                  }
                  self = this;
                  this.name = name;
              }
          })()
  
          var a = new Person('zhang san');
          Person.prototype.id = '10010';
          var b = new Person();
  
          console.log(a === b, a.id, b.id)
  ```

  这次，我们创建实例的构造函数保持一致，且变量也持久化。



### 单例模式生成器

我们知道了如何创建单例模式，但是，创建他的话是不是不小的手笔。

所以我们为了解决它，让不会使用，不知道的人也能得到一个单例模式。我们就需要封装一个生成器。

```
        var getSingle = function (func) {
            var ret = null;
            return function () {
                if (!ret) {
                    ret = func.apply(this, arguments)
                }
                return ret;
            }
        }
```

