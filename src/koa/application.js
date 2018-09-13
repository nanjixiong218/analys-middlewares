const http = require('http');
const Emitter = require('events');
const debug = require('debug')('koa:application');
// 这里即 koa-compose 中的代码，中间件函数的核心处理代码
const compose = require('./compose');
const context = require('./context');

module.exports = class Application extends Emitter {

  constructor() {
    super()
    this.middleware = []
    this.context = Object.create(context)
  }

  use(fn) {
    this.middleware.push(fn)
  }

  listen(...args) {
    debug('listen')
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  callback() {
    // 这里即中间件处理代码
    const fn = compose(this.middleware);

    const handleRequest = (req, res) => {
      // ctx 是koa的精髓之一, req, res上的很多方法代理到了ctx上, 基于 ctx 很多问题处理更加方便
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  } 
  /**
   * Handle request in callback.
   *
   * @api private
   */

  handleRequest(ctx, fnMiddleware) {
    ctx.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }

  /**
   * Initialize a new context.
   *
   * 源码中会有 koa 的 request 和 response 对象的封装，
   * 然后将 context, request, response , 原生的 req , res , 彼此进行一系列的关联
   * 这里只留下 req 和 res 用于 ctx 的代理
   * @api private
   */

  createContext(req, res) {
    const context = Object.create(this.context);
    context.app = this;
    context.req = req;
    context.res = res;
    return context;
  }
}

/**
 * Response helper.
 * 源码中这里是响应处理，主要是对 body 的各类处理和异常处理
 * 我们就简单直接输出body了
 */

function respond(ctx) {

  let body = ctx.body;

  ctx.res.end(body)
}