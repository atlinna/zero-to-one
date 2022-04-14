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

![最小生成树图](/Problem/picture/最小生成树-图.png)

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

```

function Node(value) {
    this.value = value;
    this.neighbor = []
}

let m = Infinity
let distance = [
    [0, 4, 7, 6, m],
    [4, 0, m, m, m],
    [7, m, 0, 8, 10],
    [6, m, 8, 0, m],
    [m, m, 10, m, 0],
]

let A = new Node('A')
let B = new Node('B')
let C = new Node('C')
let D = new Node('D')
let E = new Node('E')
let pointSet = [A, B, C, D, E]

function getIndex(allPointSet, target) {
    for (let i = 0; i < allPointSet.length; i++) {
        if (allPointSet[i].value == target.value) {
            return i
        }
    }
    return -1
}

function canLink(allPointSet, temp_begin, temp_end) {
    let beginIn = null;
    let beginEnd = null;
    for (let i = 0; i < allPointSet.length; i++) {
        if (getIndex(allPointSet[i], temp_begin) > -1) {
            beginIn = allPointSet[i]
        }
        if (getIndex(allPointSet[i], temp_end) > -1) {
            beginEnd = allPointSet[i]
        }
    }

    if (beginIn && beginEnd && beginIn == beginEnd) {
        return false
    }
    return true
}

function link(allPointSet, begin, end) {
    let beginIn = null;
    let beginEnd = null;
    for (let i = 0; i < allPointSet.length; i++) {
        if (getIndex(allPointSet[i], begin) > -1) {
            beginIn = allPointSet[i]
        }
        if (getIndex(allPointSet[i], end) > -1) {
            beginEnd = allPointSet[i]
        }
    }

    if (!beginIn && !beginEnd) {
        allPointSet.push([begin, end])
    } else if (!beginIn && beginEnd) {
        beginEnd.push(begin)
    } else if (!beginEnd && beginIn) {
        beginIn.push(end)
    } else if (beginIn && beginEnd && beginIn != beginEnd) {
        beginIn.concat(beginEnd)
        allPointSet.splice(allPointSet.indexOf(beginEnd), 1)
    }
}

function kruskal(pointSet, distance) {
    let allPointSet = []
    while (true) {
        let begin = null
        let end = null
        let minDis = m
        for (let i = 0; i < distance.length; i++) {
            for (let j = 0; j < distance[i].length; j++) {
                let temp_begin = pointSet[i]
                let temp_end = pointSet[j]
                let num = distance[i][j]
                if (i != j && num < minDis && canLink(allPointSet, temp_begin, temp_end)) {
                    begin = temp_begin
                    end = temp_end
                    minDis = distance[i][j]
                }
            }
        }
        begin.neighbor.push(end)
        end.neighbor.push(begin)
        link(allPointSet, begin, end)
        if (allPointSet.length == 1 && allPointSet[0].length == pointSet.length) {
            break
        }
    }
    return allPointSet[0]
}

console.log(kruskal(pointSet, distance));
```
