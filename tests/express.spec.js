var express = require('../src/express/express.js')
// var express = require('express')

var app = express()
app.listen(3000, function() {
  console.log('请打开: http://127.0.0.1:3000')
})


app.use(function(req, res, next){
  console.log('before1')
  next()
  console.log('after1')
})
app.use(async function(req, res, next){
  console.log('before2')
  await 1
  next()
  console.log('after2')
})
app.use(function(req, res, next){
  console.log('before3')
  next()
  console.log('after3')
})
app.use(function(req, res, next){
  console.log('before4')
  res.end('hello')
  console.log('after4')
})
