// var redux = require('../src/redux/redux.js')
var redux = require('redux')

var { createStore, applyMiddleware } = redux

const middleware1 = store => next => action => {
  // 每一个 next 都是 上一个 中间件
  console.log('before1')
  next(action)
  console.log('after1')
}

const middleware2 = store => next => action => {
  // 每一个 next 都是 上一个 中间件
  console.log('before2')
  next(action)
  console.log('after2')
}

function reducer(state, action) {
  if(action.type === '1' || action.type === '2') {
    return {
      ...state,
      name: state.name + action.payload
    }
  }
  return state
}

// store = applyMiddleware(middleware1, middleware2)(createStore)(reducer, {name: 'xu'})

// 另一种用法, 因为createStore内部有enhancer判断，applyMiddleware 返回的就是一个enhancer

const enhancer = applyMiddleware(middleware1, middleware2)
store = createStore(reducer, {name: 'xu'}, enhancer)
// 等价于上一条语句，可读性更好, 这就是函数柯里化的好处


store.dispatch({
  type: '1',
  payload: '-1'
})

console.log(store.getState())

store.dispatch({
  type: '2',
  payload: '-2'
})

console.log(store.getState())
