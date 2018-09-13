'use strict'

module.exports = compose

function compose (middleware) {

  return function (context, next) {
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        // 每个中间件都是一个 generator or async , 接收 context 和 next 两个参数
        // 每个中间件调用都会在 next调用处卡住知道递归执行下一个 dispatch ，取出下一个中间件
        // 这样只有后面的中间件的 dispatch resolve掉，前面的中间件才会继续执行，最外层的 dispatch(0) 才会 resolve 掉
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}