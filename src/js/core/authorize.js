'use strict';

var m = require('mithril');
var _ = require('lodash');
var helper = require('./helper');
var uuid = require('simple-uuid');
var store = require('./store');

console.log(store.getItem('username'));

/**
 * Auth is the interface to authorize then user agains the api.
 *
 * Example:
 *
 *   * Auth.username() => 'username'
 *   * Auth.device() => 'device name'
 *   * Auth.signin(username, password) => m.request promise
 *   * Auth.signout() => m.request promise
 *
 * @returns {Auth}
 */
var Auth = function () {
  if (!(this instanceof Auth)) {
    return new Auth();
  }
};

Auth.prototype = Object.create(null);
Auth.prototype.constructor = Auth;

/**
 * Save username to store or return its value.
 *
 * Example:
 *  * Auth.username('test') => Auth
 *  * Auth.username() => 'test'
 *
 * @param {string} username The username you want to store
 * @returns {string|Auth} stored username or {Auth} object
 */
Auth.prototype.username = function (username) {
  var result = store.getItem('username');
  if (username !== undefined) {
    store.setItem('username', username);
    result = this;
  }
  return result;
};

/**
 * Save the device name store or return its value.
 *
 * Example:
 *   * Auth.device() => '0AAF8E02-8F5F-4F62-81DC-BF4A4F9800ED' (UUID)
 *   * Auth.device('Notebook') => Auth
 *   * Auth.device() => 'Notebook'
 *
 * @param {string} name device name you want to store
 * @returns {string|Auth} stored device name or {Auth} object
 */
Auth.prototype.device = function (name) {
  var result = store.getItem('device');

  if (name !== undefined) {
    store.setItem('device', name);
    result = this;
  } else if (_.isUndefined(result) || _.isEmpty(result)) {
    result = uuid();
    store.setItem('device', result);
  }

  return result;
};

/**
 * Save the token to store.
 *
 * Example:
 *   * Auth.token('xfetF23467efef23!23') => Auth
 *   * Auth.token() => 'xfetF23467efef23!23'
 *
 * @param {string} token you want to store
 * @returns {string|Auth} stored token or {Auth} object
 */
Auth.prototype.token = function (token) {
  var result = store.getItem('token');

  if (token !== undefined) {
    store.setItem('token', token);
    result = this;
  }

  return result;
};

/**
 * Remove the username and token from store.
 *
 * @param {boolean} all remove device from store too.
 * @returns {Auth}
 */
Auth.prototype.clear = function (all) {

  store.removeItem('username');
  store.removeItem('token');

  if (all) {
    store.removeItem('device');
  }

  return this;
};

/**
 * Check if username and token is in the store.
 *
 * @returns {boolean}
 */
Auth.prototype.is = function () {
  return (this.username() && this.token());
};

/**
 * Sign into the api using username and password.
 *
 * @param {string} username
 * @param {string} password
 * @returns {m.request.promise} The promise of the request function.
 */
Auth.prototype.signin = function (username, password) {
  var data = {
    username: username,
    client: this.device(),
    password: password
  };
  var that = this;

  return m.request({
    url: helper.baseUrl('login'),
    method: 'POST',
    data: data
  }).then(
    function success (response) {
      if (response && response.token) {
        that.username(username);
        that.token(response.token);
      }
    },
    function error (response) {
      that.clear();
    }
  );
};

/**
 * Signout from the api, removes username and token from store and route to '/login'.
 * 
 * @returns {m.request} Promise of the request function.
 */
Auth.prototype.signout = function () {
  var that = this;

  return m.request({
    url: helper.baseUrl('logout'),
    method: 'POST',
    config: function (xhr) {
      that.setup(xhr);
    }
  }).then(
    function success (response) {
      that.clear();
      m.route('/login');
    },
    function error (response) {
      that.clear();
      m.route('/login');
    }
  );
};

/**
 * Setup the XMLHttpRequest with the Authorization header.
 * 
 * @param {XMLHttpRequest} xhr
 * @returns {boolean} true the request was modified, false there are no credentials or xhr is not a XMLHttpRequest.
 */
Auth.prototype.setup = function (xhr) {
  var result = false;
  if (this.is() && xhr && xhr.setRequestHeader) {
    xhr.setRequestHeader('Authorization', 'DimeTimetracker ' + [this.username(), this.device(), this.token()].join(','));
    result = true;
  }
  return result;
};

module.exports = new Auth();
