var http = require('http');
var flatten = require('array-flatten');
var app = exports = module.exports = {}

app.listen = function listen() {
  // 这里的this 即express.js 中的 app , 
  // 所以整个web server的入口处理程序在express文件中的app方法
  // app内部又是有app.handle来进行处理， 所以真正的处理程序是这里的app.handle, 写的比较绕
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
 * (本人的注释) express 代码里有router, route, layer等概念，app.handle 内部又交给了router.handle
 * 在这里去掉所有router, layer等概念和业务处理相关代码，直接剥离中间件相关内容
 * 
 */
app.stack = []
app.handle = function(req, res, callback) {
  // middleware and routes
  var stack = this.stack;
  var idx = 0;
  function next(err) {
    // no more matching layers
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

  // default path to '/'
  // disambiguate router.use([fn])
  if (typeof fn !== 'function') {
    var arg = fn;

    while (Array.isArray(arg) && arg.length !== 0) {
      arg = arg[0];
    }
    // first arg is the path
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