# npm_mve

## 介绍
mve核心库，可与dom无关

## 软件架构
使用纯typescript


## 特点

* 过程式（函数式）基因，比react更早。作者避免在ts/js中使用class/this等概念。
* 无组件概念，完全使用编程语言本身的模块(函数)复用。
* 基础模型只有mve.Value\<T\>和mve.ArrayModel\<T\>，构建出庞大的页面逻辑。
* 界面布局使用纯ts/js，不引入复杂的xml，更高效地复用。
* mvvm对属性节点针对性更新(受vue启发)，性能高。并创新地发现使用mve.ArrayModel\<T\>与界面片段一一对应(支持同级嵌套)，不使用虚拟DOM与任何形式的享元复用，和异步更新。
* 区分与DOM引擎无关的核心模块，可用于其它自定义引擎。并提供简单的dom桥接模块。
* 开放可定制自己的mve使用方式。
* DEMO示例地址: https://wy2010344.gitee.io/mve-vite-demo/

## 仓库位置

gitee : https://gitee.com/wy2010344/npm_mve.git

github : https://github.com/wy2010344/npm_mve.git

## 其它 

由于作者精力有限，暂时无相关文档。

创作不易，如果给你带来帮助，欢迎打赏作者，以帮助其进一步丰富相关文档。

### 微信
![微信收款码](https://wy2010344.gitee.io/article/%E5%BE%AE%E4%BF%A1%E6%94%B6%E6%AC%BE%E7%A0%81-small.png)
### 支付宝
![支付宝收款码](https://wy2010344.gitee.io/article/%E6%94%AF%E4%BB%98%E5%AE%9D%E6%94%B6%E6%AC%BE%E7%A0%81-small.png)