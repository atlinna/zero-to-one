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
            if (!targetArr || targetArr.length == 0) return
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
            // pass
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
OK,场景差不多搭建好了，我们开始创建演员啦。
我们通过构造函数 Girl 实例化四个女孩子，然后让她们的心情开始波动，然后将她们放到一个组里。有点非诚勿扰内意思哈···

```
    let MissHong = new Girl(97, 'xiaohong')
    let MissLv = new Girl(80, 'xiaolv');
    let MissHuang = new Girl(85, 'xiaohuang');
    let MissLan = new Girl(60, 'xiaolan')

    let girls = [MissHong, MissLv, MissHuang, MissLan];

    for (let girl of girls) {
        girl.changeMood()
    }
```
然后小明开始寻找目标，这里小明找到目标后还会理其他的女孩嘛？应该是不会了，除非他是渣男是吧，我们就暂且认为小明是不是个渣男，他比较专一。
我们增加方法 dontCare 意思是找到目标后，其他人就不 care 了。
```
    var XiaoMing = {
        like: null,
        findTarget: function (targetArr) {
            if (!targetArr || targetArr.length == 0) return
            let highYanzhi = targetArr.filter(item => item.yanzhi > 80);
            let key = createRandom(highYanzhi.length, 0);
            this.like = highYanzhi[key];
            this.dontCare(targetArr);
        },
        dontCare: function (targetArr) {
            targetArr.forEach(girl => {
                if (girl != this.like) {
                    clearInterval(girl.timer)
                }
            })
        },
        way: 'flower',
        sendFlower: function (target) {
            target.receiveFlower()
        },
    }
```
然后小明开始送花
```
    let MissHong = new Girl(97, 'xiaohong')
    let MissLv = new Girl(80, 'xiaolv');
    let MissHuang = new Girl(85, 'xiaohuang');
    let MissLan = new Girl(60, 'xiaolan')

    let girls = [MissHong, MissLv, MissHuang, MissLan];

    for (let girl of girls) {
        girl.changeMood()
    }

    // 小明寻找求爱目标
    XiaoMing.findTarget(girls)
    // 小明送花
    XiaoMing.sendFlower(XiaoMing.like);
```
好，女孩收到话之后，假设心情好的时候她答应，心情不好的时候就拒绝。
于是我们回到 Girl 这个构造函数，完成最后的场景。
```
    this.receiveFlower = function (){
        clearInterval(this.timer)
        if (this.mood) {
            console.log('I agree!');
        } else {
            console.log('I refuse');
        }
    }
```
运行之后我们发现，全是拒绝，这是因为我们的 mood 属性是 null，所以我们要在初始的时候创建一下心情。
```
    function Girl(yanzhi, name) {
        this.yanzhi = yanzhi;
        this.name = name;
        this.mood = null;
        this.timer = null;
        // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        // here -----------------
        createMood.call(this) // 添加初始化创建心情。
        this.receiveFlower = function () {
            clearInterval(this.timer)
            if (this.mood) {
                console.log('I agree!');
            } else {
                console.log('I refuse');
            }
        }
        this.changeMood = function () {
            let self = this
            this.timer = setInterval(function () {
                createMood.call(self)
            }, 300);
        }
        function createMood() {
            this.mood = Math.random() > 0.5;
            // console.log(this.name, this.mood);
        }
    }
```
然后我们就发现，有的时候女神会同意，但是有的时候女神会拒绝，如果我们下调女神开心的概率，是不是同意的概率大大减少了。
这个时候，假设小明有我这么一个高大帅气的朋友对吧，出于保护他的想法呢，我去替小明送花,存在一个问题，就是我能直接去送花嘛？如果我直接去送的话结果是不是差不多的，女生拒绝了小明，完事小明没想开跳楼了是吧，造成了一桩餐具，还连累了我。于是乎，我有一个很 🐂 × 的功能，类似于读心术一样的东西吧，我能看到女孩心里想的是什么。
```
    var ProxyFriend = {
        sendFlower: function (protect, target) {
            this.listenGirlMood(target, protect)
        },
        // 首先我要先知道女孩的心思 ，监听她
        listenGirlMood: function (target, protect) {
            // 我呢隔一段时间看一下，女孩的心情是不是好的
            const self = this;
            let timer = setInterval(function () {
                if (target.mood) {
                    clearInterval(timer)
                    protect.sendFlower(target)
                }
            }, 500)
        }
    }
```
然后我们修改一下下方的调用，现在由于我害怕发生悲剧，所以帮小明去送花。
```
    let MissHong = new Girl(97, 'xiaohong')
    let MissLv = new Girl(80, 'xiaolv');
    let MissHuang = new Girl(85, 'xiaohuang');
    let MissLan = new Girl(60, 'xiaolan')

    let girls = [MissHong, MissLv, MissHuang, MissLan];

    for (let girl of girls) {
        girl.changeMood()
    }

    // 小明寻找求爱目标
    XiaoMing.findTarget(girls)
    // 小明送花
    // XiaoMing.sendFlower(XiaoMing.like);
    ProxyFriend.listenGirlMood(XiaoMing.like, XiaoMing)
```
现在是不是就百发百中，起到了保护小明的作用。
