var proto = require('./application');
var mixin = require('merge-descriptors');

exports = module.exports = createApplication;

function createApplication() {
  // 感觉这里的 next 参数始终为undefined ，没有什么意义啊？
  // 源码中的 router.handle 在 next函数为 undefined 的时候写了一个默认的 done 函数作为兜底处理
  var app = function(req, res, next) {
    app.handle(req, res, next)
  }
  mixin(app, proto, false);
  return app
}