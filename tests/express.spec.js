var express = require('../src/express/express.js')
// var express = require('expresss')

var app = express()
app.listen(3000)


app.use(function(req, res, next){
  console.log(1)
  next()
  console.log('after1')
})
app.use(async function(req, res, next){
  console.log(2)
  next()
  console.log('after2')
})
app.use(function(req, res, next){
  console.log(3)
  res.end('hello')
  console.log('after3')
})
