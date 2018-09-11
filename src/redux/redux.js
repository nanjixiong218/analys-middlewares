

function createStore(reducer, preloadedState, enhancer) {
  // 是否传了state初始值的判断
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }
  // 是否应用middlewares的判断
  if (typeof enhancer !== 'undefined') {
    // 如果使用了middleware, 对createStore进行增强
    return enhancer(createStore)(reducer, preloadedState)
  }

  let currentReducer = reducer
  let currentState = preloadedState

  function dispatch(action) {
    console.log('origin dispatch')
    currentState = currentReducer(currentState, action)
    return action
  }

  function getState() {
    return currentState
  }

  // 为了初始化preloadState
  dispatch({ type: 'redux-init' })

  return {
    dispatch,
    getState
  }
}

/**
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)

    const middlewareAPI = {
      getState: store.getState,
      dispatch:  () => { // 这个 dispatch 无用, 不知道为什么要传TODO:
        throw new Error(
          `Dispatching while constructing your middleware is not allowed. ` +
            `Other middleware would not be applied to this dispatch.`
        )
      }
    }
    // 应用中间件的第层参数，其实就是把 getState 传递给中间件使用 TODO: 为什么要颗粒胡层两层参数传递
    const chain = middlewares.map(middleware => middleware(middlewareAPI))

    // redux中间件的核心就是复写 dispatch
    // 这里传入的store.dispatch 是redux最原生的dispatch，是有用的，把它传递给第一个中间件
    // 每一个中间件都会返回一个新的dispatch给下一个中间件
    // compose 带来的就是剥洋葱似的函数调用
    dispatch = compose(...chain)(store.dispatch)
    
    return {
      ...store,
      dispatch, // dispatch 覆盖
    }
  } 
}


module.exports = {
  createStore,
  applyMiddleware
}