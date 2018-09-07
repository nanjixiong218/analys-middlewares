var express = require('../src/express/express.js')

var app = express()
app.listen(3000)


app.use(function(req, res, next){
  console.log(1)
  next()
})
app.use(function(req, res, next){
  console.log(2)
  next()
})
app.use(function(req, res, next){
  console.log(3)
  res.end('hello')
})