## 栈和队列

**栈**

使用 js 封装 栈

```
function Stack() {
  this.arr = [];
  this.push = function (val) {
    this.arr.push(val);
  };
  this.pop = function () {
    this.arr.pop();
  };
}

var s = new Stack()
s.push(1)
s.push(2)
s.push(3)
console.log(s.arr)
s.pop()
s.pop()
s.pop()
console.log(s.arr)

```

**队列**

```
function Queue() {
  this.arr = [];
  this.push = function (val) {
    this.arr.push(val);
  };
  this.pop = function () {
    this.arr.shift();
  };
}
let q = new Queue();
q.push(1);
q.push(2);
q.push(3);
console.log(q.arr);
q.pop();
console.log(q.arr);

q.pop();
console.log(q.arr);
q.pop();
console.log(q.arr);

```

相对来说呢  js 来封装 栈和队列是非常简单的 因为 综合其他语言来说  他们的数组是没有 push 和 pop 这两个方法的。

### 使用辅助栈来帮助解题

### 题库
+ [20. 有效的括号](https://leetcode-cn.com/problems/valid-parentheses/)
