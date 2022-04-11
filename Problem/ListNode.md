# 链表
---
**双向链表**
双向链表的优点：

+ 无论给出哪一个节点，都能对整个链表进行遍历

缺点：

+ 多耗费一个引用的空间，而且构建双向链表比较复杂

```
function Node(value, next, pre) {
  this.value = value;
  this.next = next;
  this.pre = pre;
}
```



### 一个文档

可以看下 Leet-Book 对链表的介绍，这里就不给各位老板科普了，需要的自行百度。
https://leetcode-cn.com/leetbook/read/linked-list/x6ybqh/



### 链表题库
-- 以下题目均为 Leet-Code 题库题目 不含竞赛题、面视题，可根据题号搜索或者点击链接直达。
+ [删除链表的倒数第 N 个结点](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)
  - [答案推荐来自“起个什么名字好呢”大神，使用了三种方式来解题。值得一看](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/solution/san-chong-fang-fa-shan-chu-dao-shu-di-nge-jie-dian/)
+ [交换节点](https://leetcode-cn.com/problems/swap-nodes-in-pairs/)
  - https://leetcode-cn.com/problems/swap-nodes-in-pairs/solution/acm-xuan-shou-tu-jie-leetcode-jiao-huan-wdymm/
+ [25. K 个一组翻转链表](https://leetcode-cn.com/problems/reverse-nodes-in-k-group/)
