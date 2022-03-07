## 回溯法

### 回溯的思路
+ 有效结果：什么时候算是一个答案，应该被加入到答案列表
+ 回溯范围：下一个维度要考虑如何将当前层的答案合上一层的答案结合，并继续递归
+ 剪枝条件：是否存在一些不需要处理的情况

[39. 组合总和](https://leetcode-cn.com/problems/combination-sum/)
[46. 全排列](https://leetcode-cn.com/problems/permutations/)
[47. 全排列 II](https://leetcode-cn.com/problems/permutations-ii/)
