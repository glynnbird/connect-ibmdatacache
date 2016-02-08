/*!
 * Connect - IBM Datacache
 */

var debug = require('debug')('connect:ibmdatacache');
var util = require('util');
var noop = function(){};
var datacache = require('bluemixdatacache');


/**
 * Return the `CacheStore` extending `express`'s session Store.
 *
 * @param {object} express session
 * @return {Function}
 * @api public
 */

module.exports = function (session) {

  /**
   * Express's session Store.
   */

  var Store = session.Store;

  /**
   * Initialize RedisStore with the given `options`.
   *
   * @param {Object} options
   * @api public
   */

  function CacheStore (options) {
    if (!(this instanceof CacheStore)) {
      throw new TypeError('Cannot call CacheStore constructor as a function');
    }

    var self = this;
    options = options || {};
    Store.call(this, options);
    this.prefix = options.prefix == null
      ? 'sess:'
      : options.prefix;
    delete options.prefix;
    this.serializer = null;
    this.ttl = options.ttl;
    this.disableTTL = options.disableTTL;

    if (options.unref) this.client.unref();

  }

  /**
   * Inherit from `Store`.
   */

  util.inherits(CacheStore, Store);

  /**
   * Attempt to fetch session by the given `sid`.
   *
   * @param {String} sid
   * @param {Function} fn
   * @api public
   */

  CacheStore.prototype.get = function (sid, fn) {
    var psid = this.prefix + sid;
    if (!fn) fn = noop;
    debug('GET "%s"', sid);
    datacache.get(sid, fn);
  };

  /**
   * Commit the given `sess` object associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} fn
   * @api public
   */

  CacheStore.prototype.set = function (sid, sess, fn) {
    var psid = this.prefix + sid;
    if (!fn) fn = noop;
    debug('SET "%s"', sid);
    datacache.put(sid, sess, fn);
  };

  /**
   * Destroy the session associated with the given `sid`.
   *
   * @param {String} sid
   * @api public
   */

  CacheStore.prototype.destroy = function (sid, fn) {
    var psid = this.prefix + sid;
    debug('DEL "%s"', sid);
    datacache.remote(sid, fn);
  };

  /**
   * Refresh the time-to-live for the session with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} fn
   * @api public
   */

  CacheStore.prototype.touch = function (sid, sess, fn) {
    if (!fn) fn = noop;
    fn(null, null);
  };

  return CacheStore;
};