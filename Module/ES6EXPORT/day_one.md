# ES6 模块化

- ES 6 模块化 使用的是依赖预声明的方式导入模块
  - 依赖延迟声明
    - 优点：某些时候可以提升效率
    - 缺点：无法在一开始的时候确定模块依赖（比较模糊
  - 依赖预声明
    - 优点：在一开始可以确定依赖关系
    - 缺点：某些时候效率较低
- 灵活的多种导入导出的方式
- 导入模块必须以‘./’ 或 '../'

---

# 基本的导入导出

## 模块的引入

    type = 'module'
    <script src="./one.js" type="module"></script>

### 基本导出

- 基本导出是可以导出多条
- 类似于 CommonJs 中的 exports.xxx = 'xxx'
- 使用 export 关键字 注意：！！！！ 没有 s 不是 exports
- export 声明要导出的数据

### 基本导入

由于使用的是`依赖预加载`机制 所以要求导入内容必须在所有代码之前

- import {} from './a.js'
- import \* as obj from './a.js'
- import './a.js'

# 默认导出

- 每个模块除了允许多个基本导出的时候还允许一个默认导出
- 基本语法 export default {}
- 或者 export { 导出的数据 as default }

### 如果一个模块中即存在基本导出 也存在默认导出

- import {a,b} from '' 拿到基本导出的值
- import data,{a,b} from '' 拿到默认导出的值和基本导出的值
- import \* as data from '' 拿到所有数据 再使用 data.default 拿到默认导出的数据


### 细节
 - 尽量导出一个不可变的值
