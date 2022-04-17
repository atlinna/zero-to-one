### 二叉搜索树

假设：

有一万个书，写一个方法，进行查找给定的树，返回存在还是不存在。

要求： 尽可能的性能好。



二叉搜索树（二叉排序树）

首先这是一颗二叉树，

其次有排序的效果，左子树的节点逗比当前节点小，右子树的节点都比当前节点大。

![截屏2022-04-17 21.24.20](/Users/lucasy/workspace/new_level/note/Problem/picture/二叉搜索树-1.png)

假设现在有这么一个数列。那么我们怎么来构建二叉搜索树呢?

首先，拿到第一个数字当做根节点，然后后面的数字依次比较，比根节点小的 放左边，比根节点大的，放右边。如下

![截屏2022-04-17 21.27.23](/Users/lucasy/workspace/new_level/note/Problem/picture/二叉搜索树-2.png)

把 3 当做根节点，然后呢 1 和 3 比较 比 3 小 放在 3 的左边，5比3大 放3 的 右边，然后 4 比 3 大 但是比 5 小 放在 5 的左边，这样依次放下放。

![截屏2022-04-17 21.30.50](/Users/lucasy/Library/Application Support/typora-user-images/截屏2022-04-17 21.30.50.png)

可以发现构建完成之后的二叉搜索树就是这样的结构，我们可以发现 **节点左边的 肯定是比自己小的，节点右边的 肯定是比自己大的**。

这样我们一层一层的遍历是不是最多查找 5 次就可以了

 代码实现：

```
const { TreeNode } = require("./utils");
let arr = [3, 1, 5, 4, 2, 7, 6, 9, 10];

function addNode(root, value) {
  if (!root) return;
  if (root.value < value) {
    if (root.right) {
      addNode(root.right, value);
    } else {
      root.right = new TreeNode(value);
    }
  } else {
    if (root.left) {
      addNode(root.left, value);
    } else {
      root.left = new TreeNode(value);
    }
  }
}

function buildSearchTree(arr) {
  if (!arr || arr.length == 0) return null;
  let root = new TreeNode(arr[0]);
  for (let i = 1; i < arr.length; i++) {
    addNode(root, arr[i]);
  }
  return root;
}

console.log(buildSearchTree(arr));
```

那么 二叉搜索树我们构建出来了，要怎么去使用这个数据结构呢？

接下来我们看下如何搜索：

代码：

```
function searchByTree(root, target) {
  if (!root || !target) return false;
  if (root.value === target) return true;
  else if (root.value > target) return searchByTree(root.left, target);
  else return searchByTree(root.right, target);
}
```

这样的话我们就能查找到想要的数据了，

这样虽然是快了 ，但是还没有达到极致。

为什么这样说呢？

假设 我们使用 5 当做 根节点 的话

![截屏2022-04-17 22.14.11](/Users/lucasy/workspace/new_level/note/Problem/picture/二叉搜索树-3.png)

我们发现，刚刚我们最多需要查找5次，现在换了个节点，最多只需要查找 4 次 就能找到。

基于这个结构，能缩减查找次数的根本是什么？

是不是 这个二叉树必须是一颗满二叉树。这样能最大限度的缩小我们 整颗二叉树的深度 对吧。



**我们希望将二叉搜索树变成二叉平衡树。**



### 平衡二叉树

 首先先看一下平衡二叉树的特点

+ 根节点的左右子树的高度差不能大于1
+ 这颗二叉树的每个子树都符合第一条

