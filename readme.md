# redux, express, koa 中间件实现对比分析

这里是示例代码，简单模拟了 redux, express, koa的执行流程，剥离出了中间件的核心实现，尽量保留原始结构和主流程，去掉异常处理，完整性校验，辅助工具等干扰代码，更方便的帮助理解中间件的执行过程。


## 说明

`src` 中分别是`express`, `koa`, `redux`的模拟实现

`test` 文件夹中是三者的使用实例

## 运行

`npm install` 后直接对应运行`test`目录下的文件即可，然后查看控制台输出

### express

运行 `node tests/express.spec.js` 

访问 `http: 127.0.0.1: 3000`

查看控制台输出

`express` test 文件中有部分注释代码，用于演示 `async` 函数作为中间件，可以自行打开注释运行查看

### koa 

运行 `node tests/koa.spec.js` 

访问 `http: 127.0.0.1: 3000`

查看控制台输出

### redux

运行 `node tests/redux.spec.js` 

查看控制台输出

**每个 test 文件里面都可以替换为真正的 `express`, `koa`, `redux` 对比运行效果**