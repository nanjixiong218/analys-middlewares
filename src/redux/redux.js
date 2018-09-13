

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
 * compose(f, g, h) => (...args) => f(g(h(...args)))
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

    let dispatch = () => { 
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      // 这里很关键，也很巧妙! 没有使用store.dispatch 而是用了一个 `dispatch` 变量，下面会被compose的dispatch覆盖，
      // 这样传入 middlware 的第一个参数中的 dispatch 即为覆盖后的dispatch, 
      // 对于类似 redux-thunk 这样的中间件，内部会调用 'store.dispatch', 使得其同样会走一遍所有中间件
      dispatch: (...args) => dispatch(...args)
    }

    // 应用中间件的第一层参数, 为了给中间件暴露store的getState和dispatch方法
    const chain = middlewares.map(middleware => middleware(middlewareAPI))

    // compose 带来的就是剥洋葱似的函数调用 compose(f, g, h) => (...args) => f(g(h(...args)))
    // redux 中间件的核心就是复写 dispatch
    // 把 store.dispatch 传递给第一个中间件
    // 每一个中间件都会返回一个新的 dispatch 传递给下一个中间件
    
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