### NPM
 + 安装一个包的时候npm会自动管理依赖，它会下载该包的依赖到node_modules 目录中
 + 依赖树 -- 包 --》包有依赖 （装包的依赖 --》 再检索 包的依赖是否有依赖） --》 node_modules
 + 如果本地安装的包中带有CLI，npm 将会把CLI的脚本文件放到 ’node_modules/.bin‘ 目录下  使用npx命令 即可调用
 + 全局安装的包放置在一个特殊的全局目录中，可以通过命令 ’npm config get prfix‘
 + 全局安装  npm install --golbal 包名  || npm i -g '包名'
 + 全局安装目的： 主要的作用是为了共享全局的CLI 命令行命令

### 包的配置
生成一个配置文件  package.json
```
  -- 可以手动创建
  -- 运行 npm init 命令
  -- npm init --yes 所有的配置项全部使用默认值
```

- package.json 文件主要的作用是记录我们的项目依赖
  + dependencies: 生产环境的依赖包
  + devDependencies: 开发环境的依赖包

仅安装生产环境的依赖
npm install --production

将依赖包安装到生产环境
npm i -S || npm install --save

安装依赖到开发环境
npm i -D || npm install --save-dev

### process
process.env.NODE_ENV
**win:**
set NODE_ENV = 'development'
**mac:**
export NODE_ENV = 'development'

设置临时变量
可使用 **cross-env**

### 其他的npm 命令
+ 1、安装依赖时安装精确版本  npm install jquery --save-exact || npm i jquery -E
+ 2、安装指定版本 npm install jquery@2.2.2 || npm i jquery@2.2.2
+ 3、查询包的安装路径（一般查看全局路径） npm root 【-g】
+ 4、查看包信息 npm view '包名' view 可以 换成 show
+ npm view '报名' versions 查看包的记录 
+ npm list --depth==0【-g】 查看我们当前安装的哪些包
+ npm outdated 检查有哪些包需要更新
+ npm update '报名' 
+ npm config ls | list --json
+ npm config set 设置配置
+ npm config get 获取配置项
