## 树形结构

 树形结构 大名叫做 **有向无环图**，树是图的一种。

树形结构的特点：

+ 树形结构有一个根节点
+ 树形结构没有回路
+ 根节点为树的根
+ 叶子节点 指的是下面没有其他节点
+ 节点：既不是根节点，又不是叶子节点的普通节点

树的度：

这棵树有最多叉的节点有多少个叉这棵树的度就是多少

树的深度：

树最深有几层，树的深度就为几。





### 二叉树

 什么是二叉树呢？

二叉树指的就是**树的度**最多为2的树形结构。

二叉树的根节点就是树的根

二叉树的子节点是指某个节点下面的节点

父节点：是指某个节点的上一级节点。

叶子节点同上，指下面没有其他节点



满二叉树：

+ 所有的叶子节点都在最底层。
+ 每个非叶子结点都有两个子节点。



### 完全二叉树

国内定义：

+ 叶子结点都在最后一层或者倒数第二层
+ 叶子结点都向左聚拢



国际定义：

+ 叶子节点都在最后一层或倒数第二层（相同）
+ 如果有叶子节点，就必须有两个叶子节点。



在二叉树中，每个节点都认为自己是根节点。 像链表一样

因为二叉树中每个节点只知道自己的子节点，并不知道自己的父节点是谁。



### 子树：

子树的概念是相对的。

如果说有这样一个树结构

``` 
						A
				|				|
			  B       C
			|   |   |   |
			D   E   F   G
```

A是根节点对吧

BC 是节点

DEFG 是叶子节点

这是一个完全二叉树

然后呢每个节点都认为自己是根节点

于是 对于 根节点A来说

BDE 这个树结构是 左子树 ，CFG 这个树结构是右子树

相对于节点 B 来讲

D 是 B 的左子树 E 是 B 的右子树。

C 节点同理。

 

### 二叉树的遍历

前序遍历：先根次序遍历

指先打印根节点，然后是左子节点，最后是右子节点

中序遍历：中根次序遍历

指先打印左子节点，然后是根节点，然后是右子节点

后续遍历：后根次序遍历

指先打印左子节点，然后是右子节点，最后是根节点。



**但是要注意不要将视角只局限于当前的数，因为数结构中还包含子树。**

练习一下

```
						A
				|				|
			  B       C
			|   |   |   |
			D   E   F   G
```

还是这颗熟悉的满二叉树。写出他的，前序遍历、中序遍历、后序遍历。

前序遍历：ABDECFG

分析：

首先我们看整体的树结构

根节点是A 于是第一个是根节点 A 对吧 ，然后是打印左子节点

这个时候我们应该将视角放到左子树 BDE 中了

根据前序遍历的特点先打印根节点 B 对吧，然后看 B 下面还有子树吗 没有了，于是就是左节点 D 然后是右节点E 所以 分析到当前，我们的遍历次序应该是 ABDE。

然后我们看 A 的右子树，首先 按照前序遍历的特点 先打印根节点 C 然后看 C节点下是否存在子树 好没有，于是开始打印左子节点 F 然后是 右子节点 G

于是整体就是 ：ABDECFG

挺简单的吧

中序遍历：DBEAFCG

分析：

还是先看整体的树结构。 按照中序遍历的特点我们是不是要先打印左子节点，对于根节点下面存在子树的情况要先找子树，好我们开始

首先是根节点 A ，先打印左子节点 B 对吧，但是 B 节点下还存在 子节点，这是一个子树，于是我们先把A 放着 看B 相对于B来说 B 的子节点不存在子树 按照中序遍历的特点，先打印左子节点 D 然后是 根节点 B 然后是右子节点E B 子树看完 我们回到 A 此时 A 的左边 已经遍历完成只需要把A 放到后面是不是就行了。于是遍历到当前是 DBEA。

然后我们看A 的右边 同理，存在子树看子树，直到找到存在叶子节点的那一级，就是 C 对吧 于是按照中序遍历的特点 先打印左子树 F 然后是根节点C 最后是右子节点G 

最后打印的结果就是 ：DBEAFCG

后序遍历：DEBFGCA

根据前面两个的分析，

**首先 因为每个树节点都认为自己是根节点对吧，所以一个完整的树结构是可能存在子树的，当我们判断当前节点的时候一定要看下面是否存在子树。**

OK 了解了概念，我们来看下具体用代码如何遍历二叉树。

```
function TreeNode(value, left = null, right = null) {
  this.value = value;
  this.left = left;
  this.right = right;
}
function initTree() {
  let A = new TreeNode("A");
  let B = new TreeNode("B");
  let C = new TreeNode("C");
  let D = new TreeNode("D");
  let E = new TreeNode("E");
  let F = new TreeNode("F");
  let G = new TreeNode("G");
  A.left = B;
  A.right = C;
  B.left = D;
  B.right = E;
  C.left = F;
  C.right = G;
}
```

然后根据我们上面的数结构，构建一个关系树。

#### 前序遍历

```
function frontEach(treeNode) {
  if (!treeNode) return;
  console.log(treeNode.value);
  frontEach(treeNode.left);
  frontEach(treeNode.right);
}
```

完整代码：

```
function TreeNode(value, left = null, right = null) {
  this.value = value;
  this.left = left;
  this.right = right;
}
function initTree() {
  let A = new TreeNode("A");
  let B = new TreeNode("B");
  let C = new TreeNode("C");
  let D = new TreeNode("D");
  let E = new TreeNode("E");
  let F = new TreeNode("F");
  let G = new TreeNode("G");
  A.left = B;
  A.right = C;
  B.left = D;
  B.right = E;
  C.left = F;
  C.right = G;

  frontEach(A);
}

function frontEach(treeNode) {
  if (!treeNode) return;
  console.log(treeNode.value);
  frontEach(treeNode.left);
  frontEach(treeNode.right);
}

initTree();
```



#### 中序遍历

```
function centerEach(treeNode) {
  if (!treeNode) return;
  centerEach(treeNode.left);
  console.log(treeNode.value);
  centerEach(treeNode.right);
}
```



#### 后序遍历

```
function lastEach(treeNode) {
  if (!treeNode) return;
  lastEach(treeNode.left);
  lastEach(treeNode.right);
  console.log(treeNode.value);
}
```



#### 还原二叉树

**根据前序中序还原二叉树并写出后续遍历**

前序遍历：ABDECFG

中序遍历：DBEAFCG

分析：

首先我们知道前序遍历的规则是先根节点然后是左子树右子树，所以前序遍历的第一个节点一定是树的根节点 A，好我们有了树的根节点，再来看中序遍历，中序遍历是先打印左子树然后是根节点然后是右子树。而我们从前序遍历知道了树的根节点是 A 那么 根节点两边里的就是他的左右子树。

前序遍历：A BDE CFG

中序遍历：DBE A FCG

大概就是这样的，然后先看左子树

也就是这半部分。（含根节点）

前序遍历：A BDE 

中序遍历：DBE A 

左子树的前序遍历，第一个是根节点，所以 B 是左子树的根节点，后面的一个节点应该是左子节点对吧，然后观察树的中序遍历，中序遍历的第一个节点是左子节点，发现两两对应，D是左子树 BDE 的 左子节点，根据前序遍历特点，左子节点后面的应该是右子节点，对应中序遍历中 根节点右边的是右子节点，所以 E 是 左子树 BDE 的右子节点。现在应该是这样的

```
						A
				|				
			  B       
			|   |  
			D   E   
```

然后我们看右子树 CFG，首先根据前序遍历，第一个是根节点，然后我们回到中序遍历中找到根节点 C ，C的左边是左子树，右边是右子树。

```
						A
				|				|
			  B       C
			|   |   |   |
			D   E   F   G
```

那么这颗树的后序遍历就是 DEBFGCA



**根据中序后序还原二叉树**

中序遍历：DBEAFCG

后序遍历：DEBFGCA

分析：

首先我们根据后序遍历的特点判断，后序遍历是最后一个是根节点，那么 A 就是根节点，然后我们去中序遍历中 找到 根节点 A 那么 A 左边的就是左子树，A右边的就是右子树，中后序遍历的节点数是一致的，那么我们就能根据中序遍历得到后序遍历中左右子树的长度对吧，

中序遍历：DBE A FCG

后序遍历：DEB FGC A

然后进入到后续遍历的子树中，先左子树，因为最后一个是根节点，所以 B 是左子树的根节点，D是左子节点，E是右子节点，然后是 右子树遍历，最后一个是C，那么左边的F是左子节点，G是右子节点。



#### 使用代码还原二叉树

**根据前序中序还原二叉树**

```
function TreeNode(value, left = null, right = null) {
  this.value = value;
  this.left = left;
  this.right = right;
}

let frontEach = ["A", "B", "D", "E", "C", "F", "G"];
let centerEach = ["D", "B", "E", "A", "F", "C", "G"];

function reduction(front, center) {
  if (
    !front ||
    !center ||
    front.length !== center.length ||
    front.length == 0 ||
    center.length == 0
  )
    return null;
  let root = new TreeNode(front[0]);
  let i = center.indexOf(front[0]);
  let front_left_tree = front.slice(1, i + 1);
  let front_right_tree = front.slice(i + 1, front.length);
  let center_left_tree = center.slice(0, i);
  let center_right_tree = center.slice(i + 1, center.length);
  root.left = reduction(front_left_tree, center_left_tree);
  root.right = reduction(front_right_tree, center_right_tree);
  return root;
}
```

**根据中序后续还原二叉树**

```
function TreeNode(value, left = null, right = null) {
  this.value = value;
  this.left = left;
  this.right = right;
}

let backEach = ["D", "E", "B", "F", "G", "C", "A"];
let centerEach = ["D", "B", "E", "A", "F", "C", "G"];

function reduction(center, back) {
  if (
    !back ||
    !center ||
    back.length !== center.length ||
    back.length == 0 ||
    center.length == 0
  )
    return null;
  let root = new TreeNode(back[back.length - 1]);
  let i = center.indexOf(back[back.length - 1]);

  let center_left_tree = center.slice(0, i);
  let center_right_tree = center.slice(i + 1, center.length);

  let back_left_tree = back.slice(0, i);
  let back_right_tree = back.slice(i, back.length - 1);

  root.left = reduction(center_left_tree, back_left_tree);
  root.right = reduction(center_right_tree, back_right_tree);
  return root;
}


```



#### 二叉树的搜索

二叉树的搜索可以扩展为树的搜索、图的搜索、爬虫的逻辑、搜索引擎的爬虫算法。

1、深度优先搜索

深度优先搜索更适合探索未知。即优先走一条线

2、广度优先搜索

广度优先搜索适合探索局域。即查找同一平面。一个范围。



代码实现深度优先搜索：

```
const { TreeNode } = require("./utils.js");

function initTree() {
  let A = new TreeNode("A");
  let B = new TreeNode("B");
  let C = new TreeNode("C");
  let D = new TreeNode("D");
  let E = new TreeNode("E");
  let F = new TreeNode("F");
  let G = new TreeNode("G");
  A.left = B;
  A.right = C;
  B.left = D;
  B.right = E;
  C.left = F;
  C.right = G;

  console.log(deepSearch(A, "N"));
}

function deepSearch(node, target) {
  if (!node) return false;
  if (node && node.value === target) return true;
  let left_ret = deepSearch(node.left, target);
  let right_ret = deepSearch(node.right, target);
  return left_ret || right_ret;
}

initTree();

```

通过代码我们可以发现，二叉树的深度优先搜索是不是和前序遍历的顺序是一样的？



代码实现广度优先搜索：

```
const { TreeNode } = require("./utils.js");
function initTree() {
  let A = new TreeNode("A");
  let B = new TreeNode("B");
  let C = new TreeNode("C");
  let D = new TreeNode("D");
  let E = new TreeNode("E");
  let F = new TreeNode("F");
  let G = new TreeNode("G");
  A.left = B;
  A.right = C;
  B.left = D;
  B.right = E;
  C.left = F;
  C.right = G;

  console.log(bredthSearch([A], "N"));
}

function bredthSearch(nodeList, target) {
  if (nodeList.length == 0 || !nodeList) return false;
  let ret = [];
  for (let i = 0; i < nodeList.length; i++) {
    if (!nodeList[i]) {
      continue;
    } else if (nodeList[i].value === target) {
      return true;
    } else {
      ret.push(nodeList[i].left);
      ret.push(nodeList[i].right);
    }
  }
  return bredthSearch(ret, target);
}

initTree();

```



#### 二叉树的比较

```
const { TreeNode } = require("./utils.js");
let A1 = new TreeNode("A");
let B1 = new TreeNode("B");
let C1 = new TreeNode("C");
let D1 = new TreeNode("D");
let E1 = new TreeNode("E");
let F1 = new TreeNode("F");
let G1 = new TreeNode("G");
A1.left = B1;
A1.right = C1;
B1.left = D1;
B1.right = E1;
C1.left = F1;
// C1.right = G1;

let A2 = new TreeNode("A");
let B2 = new TreeNode("B");
let C2 = new TreeNode("C");
let D2 = new TreeNode("D");
let E2 = new TreeNode("E");
let F2 = new TreeNode("F");
let G2 = new TreeNode("G");
A2.left = B2;
A2.right = C2;
B2.left = D2;
B2.right = E2;
C2.left = F2;
// C2.right = G2;

function compareTree(tree1, tree2) {
  if (tree1 == tree2) return true;
  if ((tree1 && !tree2) || (!tree1 && tree2) || tree1.value !== tree2.value)
    return false;
  let left_tree = compareTree(tree1.left, tree2.left);
  let right_tree = compareTree(tree1.right, tree2.right);
  return left_tree && right_tree;
}

let r = compareTree(A1, A2);
console.log(r);

```

**注意：**

遇到二叉树比较的问题时，必须要确定，左右两颗子树如果交换位置，即左右互换算不算同一颗二叉树。

如果是笔试的话，没有特殊说明左右互换还是同一颗树，那么默认互换后不是同一颗树。（尽量还是问下面试官。）

上述代码是 当二叉树互换不是同一颗树的情况。

那么我们怎么来比较左右子树互换的二叉树呢？

只需要在代码上稍微改动一下

```
function compareTree(tree1, tree2) {
  if (tree1 == tree2) return true;
  if ((tree1 && !tree2) || (!tree1 && tree2) || tree1.value !== tree2.value)
    return false;
  let same_tree =
    compareTree(tree1.left, tree2.left) &&
    compareTree(tree1.right, tree2.right);
  let different_tree =
    compareTree(tree1.left, tree2.right) &&
    compareTree(tree1.right, tree2.left);
  return same_tree || different_tree;
}
```

假设 我们 先判断 相同的树，不同的话就会去判断 不同的树比较，比较的规则是 tree1 的左子树和 tree2 的右子树相比，如果这个不同的话另一边是不是不用看了 对吧？ 如果相同那么根据二叉树的特点，另一边肯定是相同的。



#### 二叉树 diff 算法 （diff dom）

我们看下虽然我们能够比较出两颗二叉树之间是否是相同的，但是我们不能知道不同的地方在哪里？ 也就是 这棵树新增了什么、删除了什么、修改了什么。如果是在 dom 中使用，我们是不是要知道 dom 结构到底经历了什么样的变化啊。

所以，我们来看看 树的 diff 算法

```
const { TreeNode } = require("./utils");
let A1 = new TreeNode("A");
let B1 = new TreeNode("B");
let C1 = new TreeNode("C");
let D1 = new TreeNode("D");
let E1 = new TreeNode("E");
let F1 = new TreeNode("F");
let G1 = new TreeNode("G");
A1.left = B1;
A1.right = C1;
B1.left = D1;
B1.right = E1;
C1.left = F1;
C1.right = G1;

let A2 = new TreeNode("A");
let B2 = new TreeNode("B");
let C2 = new TreeNode("C");
let D2 = new TreeNode("D");
let E2 = new TreeNode("E");
let F2 = new TreeNode("F");
let G2 = new TreeNode("G");
A2.left = B2;
A2.right = C2;
B2.left = D2;
B2.right = E2;
C2.left = F2;
C2.right = G2;

/**
 我们希望得到的是不是一个 装有 新增、修改、删除的一个节点的集合，
 如 :
 { type:'add',old:B,now:C },
 { type:'delete',old:B,now:C },
 { type:'modify',old:B,now:C },
 这样能更好的让我们进行下面的逻辑，
 对比 dom 的操作
 */
let diffList = [];
function diffTree(node1, node2, diffList) {
  if (node1 == node2) {
    return diffList;
  } else if (!node1 && node2) {
    diffList.push({ type: "add", old: null, now: node2 });
  } else if (node1 && !node2) {
    diffList.push({ type: "delete", old: node1, now: null });
  } else if (node1.value != node2.value) {
    diffList.push({ type: "modify", old: node1, now: node2 });
  } else {
    diffTree(node1.left, node2.left, diffList);
    diffTree(node1.right, node2.right, diffList);
  }
}

diffTree(A1, A2, diffList);
console.log(diffList);
```

这样我们就能得到一颗 装有状态和新旧节点的 一个 array ，这个 array 将会告诉我们 树改变了什么。

但是现在这个 diff 算法有一些问题，假设，我们将 右子树根节点 C 改变，再将下面的子节点改变。就无法 diff 出子节点的变化。 

```
let A2 = new TreeNode("A");
let B2 = new TreeNode("B");
let C2 = new TreeNode("N");
let D2 = new TreeNode("D");
let E2 = new TreeNode("E");
let F2 = new TreeNode("F");
let G2 = new TreeNode("M");
// diff 出的结果只有 C 变为 N
```

思考一下为什么会这个样子？ 我们肯定是要拿到完整的树结构变化的，不能说 我的父节点变了，我子节点就不管了。

是的

是的

因为我们发现，在修改的时候，如果这是叶子节点还好说，如果是根节点的话，那么就不会继续 diff 子节点了 对吧，所以呢 我们要让他继续 diff。

```
else if (node1.value != node2.value) {
    diffList.push({ type: "modify", old: node1, now: node2 });
  }
```

修改后：

```
function diffTree(node1, node2, diffList) {
  if (node1 == node2) {
    return diffList;
  } else if (!node1 && node2) {
    diffList.push({ type: "add", old: null, now: node2 });
  } else if (node1 && !node2) {
    diffList.push({ type: "delete", old: node1, now: null });
  } else if (node1.value != node2.value) {
    diffList.push({ type: "modify", old: node1, now: node2 });
    diffTree(node1.left, node2.left, diffList);
    diffTree(node1.right, node2.right, diffList);
  } else {
    diffTree(node1.left, node2.left, diffList);
    diffTree(node1.right, node2.right, diffList);
  }
}
```

是不是 当我们 push 一个修改状态的时候，还需要继续 diff 下面的 子节点啊
