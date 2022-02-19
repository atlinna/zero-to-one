# Javascript - 高阶函数
这一章主要给大家介绍一下 Javascript 中的高阶函数， 在 Javascript 中，函数是一种特殊类型的对象，称为 Function Objects。


### 高阶函数
什么是高阶函数呢？如何判断一个函数是不是高阶函数？
高阶函数要满足以下两个条件：
+ 接受一个或多个函数作为输入
+ 输出一个函数

就是说高阶函数是对其他函数进行操作的函数，可以将他们作为参数传递，或者是返回他们。 
总结起来就是，高阶函数是一个接受函数作为参数或将函数作为返回值输出的函数。


### 内置高阶函数（built-in）
Javascript 语言内置了一些高阶函数，比如 Array.prototype.map, Array.prototype.filter, Array.prototype.reduce, 他们接受一个函数作为参数，并应用这个函数到列表的每一个元素。
接下来我们对比一下使用高阶函数和不使用高阶函数。

**Array.prototype.map**  
map 方法创建一个新的数组，返回的结果是该数组中的每项都调用一个提供的函数后返回的结果，原数组不会改变，原数组不会改变。 传递给 map 的回调函数有三个参数，分别是 item（项），index（索引、可选），self（自身数组、可选），map 方法除了可以接受一个回调函数外还能接受一个 this 值（可选），用来执行回调函数中使用的 this。

练习：我们要生成一个新数组，数组中的每一项都是 arr 中的每一项的两倍。
```
<!-- 不使用高阶函数 -->
var arr = [1, 2, 3, 4];
var brr = []

for (var i = 0; i < arr.length; i++) {
    brr.push(arr[i] * 2)
}

console.log(brr, arr); //(4) [2, 4, 6, 8] (4) [1, 2, 3, 4]


<!-- 使用高阶函数 -->
var arr = [1, 2, 3, 4];

var brr = arr.map(function (item, index, self) {
    return item * 2
})

console.log(brr, arr); //(4) [2, 4, 6, 8] (4) [1, 2, 3, 4]
```

**Array.prototype.filter**  
filter 方法创建一个新数组，其包含通过提供函数实现的过滤元素，原数组不会改变。参数同 map 相同，返回值是个新数组、 数组中是由符合条件的项构成，如果都不符合，则数组为空。

练习：
现有一个数组 [1,2,3,1,2,3,1,1,1,2,3,4,5,6,2,2,4,5] , 我们想要生成一个新数组，这个数组要去重（去掉重复的内容）。
```
<!-- 不使用高阶函数 -->
var arr = [1, 2, 3, 1, 2, 3, 1, 1, 1, 2, 3, 4, 5, 6, 2, 2, 4, 5];

var brr = [];

for (var i = 0; i < arr.length; i++) {
    if (brr.indexOf(arr[i]) === -1) {
        brr.push(arr[i])
    }
}

console.log(brr, arr); // (6) [1, 2, 3, 4, 5, 6] 


<!-- 使用高阶函数 -->
var arr = [1, 2, 3, 1, 2, 3, 1, 1, 1, 2, 3, 4, 5, 6, 2, 2, 4, 5];

var brr = arr.filter(function (item, index, self) {
    return self.indexOf(item) === index;
})

console.log(brr, arr); // (6) [1, 2, 3, 4, 5, 6] 
/*
  解析：
  为什么这样可以去重？
  因为 self 代表的是原数组本身 也就是 arr 
  arr.indexOf(item) 返回的是第一个符合元素的索引
  也就是说只要不重复那么 arr.indexOf(item) 的值就会等于 index
*/

```














