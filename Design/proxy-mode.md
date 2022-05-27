# 设计模式 - 代理模式

定义：为一个对象添加一种代理来控制对这个对象的访问。

代理对象类似于房产中介，比如说你有一个租房子的需求，但是呢你没有什么时间去自己找房源对吧？于是呢，你找到了房产中介，房产中介有一个好处就是，他帮助房东寻找租客，换句话说就是，我们通过中介的代理找到房东，并且租他的房子对把。

### 代理模式分类

+ 虚拟代理：

  虚拟代理是吧一些开销很大的对象，延迟到真正需要他的时候才去创建执行

  比如说，你有一个对象，有一天你准备回家，你对象给你发语音说，想吃南城的煎饼，

  完事你一想估计还有别的要求，于是你等了一会，果不其然嗷，又来一条消息说还想吃哪哪哪的蛋糕，完事还想喝楼下那家店的奶茶。这样你已经知道了所有要做的事情是不是就可以规划一条最佳的路线出来。否则有没有可能就是你到了南城，然后跑到北城，再窜回南城。

  图片加载，文件上传。

+ 安全代理：

  控制真实对象的访问权限

  登录操作后才能看全部功能、权限校验

+ 远程代理：

  一个对象将不同空间的对象进行局部代理。

  监控多个对象的状态，总机监控分店

+ 智能代理：

  调用对象代理处理另外一些事情，如垃圾回收机制增加额外服务。

  提供额外的其他服务 火车站代售
  
我们一起来看下代理模式是怎么运作的
假设，我有一个朋友叫小明，小明呢交友广泛，最喜欢的事情就是找女朋友，然后呢他追女孩的手段就是送花。
我们构建一个对象出来。
```
    var XiaoMing = {
        like: null,
        findTarget: function (target) {
            this.like = target;
        },
        way: 'flower',
        sendFlower: function (target) {
            target.receiveFlower()
        }
    }
```
然后小明呢也不是随便的人，他呢喜欢颜值高的女生。不是见一个爱一个,然后我们粗略的修改一下我们的方法
我们说这个小明啊，首先会把女孩的研制先筛选一遍，然后从心仪的女孩**们**中随便找一个，开启猛烈的攻势。
```
    function createRandom(max, min) {
        let t = Math.floor(Math.random() * (max + 1 - min)) + min
        return t
    }

    var XiaoMing = {
        like: null,
        findTarget: function (targetArr) {
            if (!targetArr || targetArr.length) return
            let highYanzhi = targetArr.filter(item => item.yanzhi > 80); // 我们假设小明喜欢颜值高于80的女生
            let key = createRandom(highYanzhi.length, 0);
            this.like = highYanzhi[key];
        },
        way: 'flower',
        sendFlower: function (target) {
            target.receiveFlower()
        },
    }
```
OK ，然后就是女孩，女孩的特性差不多都是相同的，这里我们使用一个构造函数来创建。
首先，女生需要有颜值对吧，有姓名，然后呢她还能接受小明送出的花。
```
function Girl(yanzhi, name) {
    this.yanzhi = yanzhi;
    this.name = name;
    this.receiveFlower = function () {
      // pass
    }
}
```
我们假设女孩子会有小脾气对吧，而且呢，这个小脾气阴晴不定，时好时坏的。这时候我们增加一些属性和方法来描述女孩的心情。
```
    function Girl(yanzhi, name) {
        this.yanzhi = yanzhi;
        this.name = name;
        this.mood = null;
        this.timer = null;
        this.receiveFlower = function () {
            changeMood();
        }
        this.changeMood = function () {
            this.timer = setInterval(function () {
                createMood()
            }, 300);
        }
        function createMood() {
            this.mood = Math.random() > 0.5;
            console.log(this.name, this.mood);
        }
    }
```
