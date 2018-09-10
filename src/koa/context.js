
'use strict';

/**
 * Module dependencies.
 */

const util = require('util');
const delegate = require('delegates');

/**
 * Context prototype.
 */

const proto = module.exports = {
  onerror: function(err) {
    console.log(err)
  }
};

/**
 * Response delegation.
 */

delegate(proto, 'res')
  .method('setHeader')

/**
 * Request delegation.
 */

delegate(proto, 'req')
  .access('url')
  .setter('href')
  .getter('ip');
