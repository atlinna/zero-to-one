## 最小生成树

如何计算图的最小生成树呢？

有两种算法

+ 普利姆算法 （加点法）
+ 克鲁斯卡尔算法 （加边法）





### 普利姆算法（加点法） 

特点

1、任选一个点作为起点

2、找到以当前选中点为起点路径最短的边

3、如果这个边的另一端没有被连通进来，那么就连接

4、如果这个边的另一端早就被连接进来，那么看倒数第二短的边

5、重复 2-4 过程，直到所有的点都连通为止。

![最小生成树图](/Users/lucasy/workspace/new_level/note/Problem/picture/最小生成树-图.png)

```
/**
 * 普利姆算法
 */
 /*
 图节点
 function PNode(value){
 		this.value = value;
 		this.neighbor = [];
 }
 */
const { PNode } = require("./utils");
var max = Infinity;
var A = new PNode("A");
var B = new PNode("B");
var C = new PNode("C");
var D = new PNode("D");
var E = new PNode("E");
var pointSet = [A, B, C, D, E];
var distance = [
  [0, 5, 4, 6, max],
  [5, 0, 8, 7, max],
  [4, 8, 0, max, max],
  [6, 7, max, 0, 6],
  [max, max, max, 6, 0],
];
function getIndex(target, pointSet) {
  for (let i = 0; i < pointSet.length; i++) {
    if (pointSet[i].value == target.value) {
      return i;
    }
  }
  return -1;
}

function getMinDistance(pointSet, distance, nowPointSet) {
  let fromNode = null;
  let endNode = null;
  let MinDistan = max;
  for (let i = 0; i < nowPointSet.length; i++) {
    let nowPointIndex = getIndex(nowPointSet[i], pointSet);
    for (let j = 0; j < distance[nowPointIndex].length; j++) {
      let thisNode = pointSet[j];
      if (
        nowPointSet.indexOf(thisNode) == -1 &&
        distance[nowPointIndex][j] < MinDistan
      ) {
        fromNode = nowPointSet[i];
        endNode = thisNode;
        MinDistan = distance[nowPointIndex][j];
      }
    }
  }
  fromNode.neighbor.push(endNode);
  endNode.neighbor.push(fromNode);
  return endNode;
}

function prim(pointSet, distance, start) {
  let allPointList = [];
  allPointList.push(start);
  while (true) {
    let minDistanceNode = getMinDistance(pointSet, distance, allPointList);
    allPointList.push(minDistanceNode);
    if (allPointList.length === pointSet.length) {
      break;
    }
  }
  return allPointList;
}

console.log(prim(pointSet, distance, A))

```



### 克鲁斯卡尔算法（加边法）

特点

1、找到最短的边以这条边为起点。

2、要保证边连接的两端至少有一个点是新的点。

3、或者 这个边是将两个部落进行连接的。

4、重复 1-3 直到所有的点都连接到一起。

