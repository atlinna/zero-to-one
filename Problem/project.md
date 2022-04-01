### 链表的逆转（逆转链表）

```
// 逆转链表
function linkedReverse(node) {
  if (!node.next.next) {
    node.next.next = node;
    return node.next;
  } else {
    var ret = linkedReverse(node.next);
    node.next.next = node;
    node.next = null;
    return ret;
  }
}
```

这个要怎么想呢？

首先我们要先找到递归的出口，我们首先是不是要找到最后一个节点，然后让最后一个节点的next 指向我们前一个节点。



### 排序

首先我们要了解排序的本质，什么是排序呢？

给你一个数组 你会用什么样的方式对内部元素进行排序呢？

我们忘记创建代替数组，通过删除数组内部元素来排序的方式，因为这代表着你有更大的空间消耗，而且还删除了数组内部元素，性能可以说极差。

记住，排序不是比较大小。

排序是比较和交换的过程。

**冒泡排序：**

```
function compare(a, b) {
  return a > b;
}

function exchange(array, a, b) {
  let temp = array[a];
  array[a] = array[b];
  array[b] = temp;
}

function sort(array) {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (compare(array[j], arr[j + 1])) {
        exchange(array, j, j + 1);
      }
    }
  }
}
```

冒泡排序的本质呢，就是每次都会将两者之中最大的置于后面，这样当每一层循环结束，能够保证，最后面那个一定是最大的（或最小的，根据 compare中的定义来判断）

**每次都会交换一个两者之中的最大值（或最小值）放在后面**

接下来我们看选择排序》

**选择排序**

```
function compare(a, b) {
  return a < b;
}

function exchange(array, a, b) {
  let temp = array[a];
  array[a] = array[b];
  array[b] = temp;
}

// 选择排序
function sort(array) {
  for (let i = 0; i < array.length - 1; i++) {
    let maxIndex = 0;
    for (let j = 0; j < array.length - 1 - i; j++) {
      if (compare(array[maxIndex], array[j + 1])) {
        maxIndex = j + 1;
      }
    }
    exchange(array, maxIndex, array.length - i - 1);
  }
}
```

我们看下选择排序的原理，他呢和冒泡排序机器相似，但是有一个地方不同

我们冒泡排序的时候，每次比较都会进行元素置换，但是选择排序是取最大的（或最小的）那个元素和最后一个元素进行置换。从而达到排序的目的。

