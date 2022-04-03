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

**快速排序：**

快速排序呢比较不好理解，希望能多看几遍然后自行推导一下，如果感兴趣的话可以去看一下《算法导论》讲述了 算法推导的全过程。

首先我们先来看一下快排的工作原理：

![截屏2022-04-03 下午11.06.39](/Users/lucasy/workspace/new_level/note/Problem/picture/截屏2022-04-03 下午11.06.39.png)

可以先看下图，不知道画的清不清楚，

首先呢，我们拿到原数组之后第一次排序，我们先拿到一个对照点，比如取数组第一个元素， 然后呢和数组中其他元素进行比对，比这个点小的 就站在 对照点的左边，比对照点大的，就站在对照点的右边。

理论如此，我们上代码

```
function quickSort(arr) {
  if (!arr || arr.length < 1) return [];

  var left = [];
  var right = [];
  var current = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < current) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  left = quickSort(left);
  right = quickSort(right);

  return left.concat([current], right);
}
```

首先呢，我们看下 核心部分，使用一个循环来对比元素的大小。将比对照点大的放到 right 数组，然后将比对照点小的放到 left 数组中。但是这样不够，为什么不够呢

这只进行了一次排序然后将大小分组对吧

没错，然后重点来了，看到下面这里

```
  left = quickSort(left);
  right = quickSort(right);
```

我们继续递归来排序，各自的数组，想象一下，当你走到最后一个的时候，left、right 都是空数组了，空数组走到严谨性判断直接返回也就不会继续走这两行代码。于是递归结束。懂了？

上面这个呢是简化版本的快速排序，可以发现创建了很多辅助数组，牺牲了额外的内存空间来完成排序，也是可以的

接下来我们看下标准的快速排序。

```
function exchange(arr, a, b) {
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

function quickSort(arr, begin, end) {
  if (begin >= end - 1) return;
  let left = begin;
  let right = end;
  do {
    do left++;
    while (left < right && arr[left] < arr[begin]);
    do right--;
    while (right > left && arr[right] > arr[begin]);
    if (left < right) exchange(arr, left, right);
  } while (left < right);
  let current = left == right ? right - 1 : right;
  exchange(arr, begin, current);
  quickSort(arr, begin, current);
  quickSort(arr, current + 1, end);
}

function main(arr) {
  quickSort(arr, 0, arr.length);
}
```

思想是相同的，只不过没有了额外的辅助数组

多多练习

