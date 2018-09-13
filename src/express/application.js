var http = require('http');
var flatten = require('array-flatten');
var app = exports = module.exports = {}

app.listen = function listen() {
  // 这里的 this 即 express.js 中的 app , 
  // 所以整个 web server的入口处理程序是 express.js 文件中的 app 方法
  // app 方法使用 app.handle 来进行处理， 所以真正的处理程序是这里的 app.handle, 所以会比较绕
  var server = http.createServer(this) 

  return server.listen.apply(server, arguments)
}
/**
 * (源码中的注释)Dispatch a req, res pair into the application. Starts pipeline processing.
 *
 * If no callback is provided, then default error handlers will respond
 * in the event of an error bubbling through the stack.
 * @private
 *
 * (本人的注释) express 代码里有 router, route, layer 等概念，app.handle 内部又交给了router.handle 来处理
 * 在这里去掉所有 router, layer 等概念，直接剥离中间件相关内容
 * 
 */
app.stack = []
app.handle = function(req, res, callback) {
  var stack = this.stack;
  var idx = 0;
  function next(err) {
    if (idx >= stack.length) {
      callback('err') 
      return;
    }
    var mid;
    while(idx < stack.length) {
      mid = stack[idx++];
      mid(req, res, next);
    }
  }
  next()
}

app.use = function(fn) {
  var offset = 0;
  var path = '/';
  if (typeof fn !== 'function') {
    var arg = fn;

    while (Array.isArray(arg) && arg.length !== 0) {
      arg = arg[0];
    }
    if (typeof arg !== 'function') {
      offset = 1;
      path = fn;
    }
  }
  var callbacks = flatten(Array.prototype.slice.call(arguments, offset))

  for (var i = 0; i < callbacks.length; i++) {
    var fn = callbacks[i];
    this.stack.push(fn)
  }

  return this;
}