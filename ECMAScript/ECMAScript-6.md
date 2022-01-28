# ECMAScript 6 review -- The boy who slays the dragon will eventually become a demon dragon.


### 箭头函数
对于箭头函数，最大的难点就是他的this
对于普通函数而言，this的指向取决于调用该函数的对象 简而言之就是 谁调用这个函数，this就指向谁
```
function test(){
  console.log(this.name);
}
const user = {
  name:'zhangsan',
  foo:test
}

user.foo()
handler = user.foo
handler()

```
上面代码块展现出了两种方式第一种，调用 foo 此时 函数内的 this 指向的是 user 因为 是user去调用的 foo 函数
第二种 将索引赋值给handler 然后执行handler 我们知道 再全局作用域下 声明 相当于就是再全局对象中 也就是说
我们的handler执行 就相当于是 window.handler() 调用的 是我们的全局对象 那么肯定this就不会指向user。


对于箭头函数，箭头函数中的this指向是根据外层处在的环境 和 作用域决定的
什么是外层处在的环境 就是储在函数内部 或者是在全局。 你的箭头函数 是否为嵌套再 其他函数内部的。
+ 箭头函数不绑定this，箭头函数中的this相当于普通变量。
+ 箭头函数的this寻值与变量相似，在作用域中逐级寻找。
+ 箭头函数的this不能通过bind，call，apply来主动修改，但是可以通过改变外层函数的作用域来改变箭头函数的this
+ 改变作用域中 this 的指向就能改变箭头函数的this。
      
现在我们根据几个例子来加强对箭头函数的应用：
下面的console.log依次输出的是什么内容？
```
var name = 'window'

var person1 = {
    name: 'person1',
    show1: function () {
        console.log(this.name)
    },
    show2: () => console.log(this.name),
    show3: function () {
        return function () {
            console.log(this.name)
        }
    },
    show4: function () {
        return () => console.log(this.name)
    }
}
var person2 = { name: 'person2' }

person1.show1()
person1.show1.call(person2)

person1.show2()
person1.show2.call(person2)

person1.show3()()
person1.show3().call(person2)
person1.show3.call(person2)()

person1.show4()()
person1.show4().call(person2)
person1.show4.call(person2)()
```
**分析：**  
由于这个代码块没有其他的逻辑 我们直接看函数执行和函数本体。
首先是第一个 person1.show1() 我们发现有上下文 是通过上下文隐式绑定的this this指向的是person1
第二个 person1.show1.call(person2) 这是显式绑定的 this 函数内 this 应该指向 person2 

第三个 person1.show2() 有上下文但是 发现show2 这个函数是箭头函数， 我们知道箭头函数的 this 是通过作用域逐级查找的 它的上一层是全局作用域 也就是说 this 指向的是全局对象。
第四个 person1.show2.call(person2) 由于 show2 是箭头函数 所以是不能通过 bind，apply，call 来直接改变this 指向的 所以 还是指向全局对象。

第五个 person1.show3()() 我们先看函数体 show3， show3 是 返回了一个函数 然后是函数自执行 现在我们分开来看 如果只是执行 person1.show3 我们的 this 指向谁？ 是不是person1
但是现在 person1.show3 执行完毕后 返回了一个函数 这个函数是不是相当于在全局对象下的调用 也就是说 我们这个返回的函数的this 指向 全局对象 换一种表现方式就相当于 
var b = person1.show3(); b();这是属于 this 指向丢失。

第六个 person1.show3().call(person2) 老规矩 我们拆开来看  person1.show3 会返回一个新函数 然后呢 显式的为这个返回的新函数绑定 this 到 person2 现在就很明显了对吧？
第七个 person1.show3.call(person2)() 同第五个

第八个 person1.show4()() 首先先看函数体，与show3不同的一点是 它返回的是一个箭头函数，我们都知道箭头函数的特点对吧 也就是说 show4的结果直接取决于 外层函数的this指向
那就简单了 我们直接来分析show4的指向就好 可以直接看出 show4指向的是 person1 隐式绑定

第九个 person1.show4().call(person2) 箭头函数的 this 不会因为 call 改变 所以还是指向 person1
第十个 person1.show4.call(person2)() 由于show4的this 通过call 显式改变为 person2 所以 箭头函数指向 person2
答案:
```
person1.show1() // person1，隐式绑定，this指向调用者 person1 
person1.show1.call(person2) // person2，显式绑定，this指向 person2

person1.show2() // window，箭头函数绑定，this指向外层作用域，即全局作用域
person1.show2.call(person2) // window，箭头函数绑定，this指向外层作用域，即全局作用域

person1.show3()() // window，默认绑定，这是一个高阶函数，调用者是window
				  // 类似于`var func = person1.show3()` 执行`func()`
person1.show3().call(person2) // person2，显式绑定，this指向 person2
person1.show3.call(person2)() // window，默认绑定，调用者是window

person1.show4()() // person1，箭头函数绑定，this指向外层作用域，即person1函数作用域
person1.show4().call(person2) // person1，箭头函数绑定，
							  // this指向外层作用域，即person1函数作用域
person1.show4.call(person2)() // person2
```

ok 那么如果我们搞定了 普通函数和箭头函数的组合 现在我们可以尝试一个新的 就是在构造函数中， 如下
```
var name = 'window'

function Person (name) {
  this.name = name;
  this.show1 = function () {
    console.log(this.name)
  }
  this.show2 = () => console.log(this.name)
  this.show3 = function () {
    return function () {
      console.log(this.name)
    }
  }
  this.show4 = function () {
    return () => console.log(this.name)
  }
}

var personA = new Person('personA')
var personB = new Person('personB')

personA.show1()  // personA
personA.show1.call(personB) // personB

personA.show2() // personA
personA.show2.call(personB) // personA

personA.show3()() // window
personA.show3().call(personB) // personB
personA.show3.call(personB)() // window

personA.show4()() // personA
personA.show4().call(personB) // personA
personA.show4.call(personB)() // personB
```
第一个和第二个的区别就是在于 题目使用了 new
new 操作符的作用：
+ 创建一个新对象
+ 将构造函数的作用域赋给新对象
+ 执行构造函数中的代码 （为新对象添加属性）
+ 返回新对象

也就是说当我们判断作用域在 person 构造函数中的时候 this 指向自身
有区别的就是我们的show2 因为箭头函数是根据上层作用域来判断 this ，上层作用域是 person 由于我们在new 实例的时候 new 会绑定 this 就是说谁调用这个函数 就指向谁。
其他没什么区别
答案：
```
personA.show1()  // personA
personA.show1.call(personB) // personB

personA.show2() // personA
personA.show2.call(personB) // personA

personA.show3()() // window
personA.show3().call(personB) // personB
personA.show3.call(personB)() // window

personA.show4()() // personA
personA.show4().call(personB) // personA
personA.show4.call(personB)() // personB
```
















