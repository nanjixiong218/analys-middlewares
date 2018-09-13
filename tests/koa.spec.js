var Koa = require('../src/koa/application.js')
// var Koa = require('koa')
var app = new Koa()
app.listen(3000, function() {
  console.log('请打开: http://127.0.0.1:3000')
})


app.use(async function(ctx, next){
  console.log('before1')
  await next()
  console.log('after1')
})
app.use(async function(ctx, next){
  console.log('before2')
  next()
  console.log('after2')
})
app.use(function(ctx, next){
  console.log('before3')
  ctx.body = 'hello'
  console.log('after3')
})
