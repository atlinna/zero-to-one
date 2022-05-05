### Promise - 20 行

#### 实现：
```
    function myPromise(fn) {
        this.cbs = [];
        const resolve = (value) => {
            setTimeout(() => {
                this.data = value;
                this.cbs.forEach(cb => {
                    cb(value)
                })
            })
        }

        fn(resolve.bind(this))
    }

    myPromise.prototype.then = function (onResolved) {
        return new myPromise((resolve) => {
            this.cbs.push(() => {
                const ret = onResolved(this.data);
                if (ret instanceof myPromise) {
                    ret.then(resolve)
                } else {
                    resolve(ret)
                }
            })
        })

    }
```
