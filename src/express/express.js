var proto = require('./application');
var mixin = require('merge-descriptors');

exports = module.exports = createApplication;

function createApplication() {
  // TODO: 这里的next 为undefined啊，感觉是没有意义的
  // 源码中的router.handle 在next函数为 undefined 的时候写了一个默认的 done 函数作为兜底处理
  var app = function(req, res, next) {
    app.handle(req, res, next)
  }
  mixin(app, proto, false);
  return app
}