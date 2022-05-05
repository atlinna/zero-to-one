## 手写系列

首先我们要明白一点，内置对象、操作符都是通过 C 语言实现，我们能做的只是通过描述来还原他的过程。
我们能做的就是**无限的趋近于原生**。
当然，js 中存在一部分是我们无法还原的 我们简称它为**魔法**。
什么是魔法呢？
就是你不知道这东西怎么来的，而且它就能给你你想要的。

所有的手写都是根据 [【MDN】](https://developer.mozilla.org/) 中的标准描述还原。

+ [【new】](/new.md)
+ [【instanceof】](/instanceof.md)

Function.prototype
+ [【call】](/call.md)
+ [【apply】](/apply.md)
+ [【bind】](/bind.md)

Array.prototype
+ [【isArray】](/isArray.md)
+ [【forEach】](/forEach.md)
+ [【map】](/map.md)


Object.prototype
+ [【create】](/create.md)
+ [【assign】](/assign.md)
+ [【freeze】](/freeze.md)


Promise
+ [【手写Promise 20行】](/Promise-20.md)
