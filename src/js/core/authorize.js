'use strict';

var m = require('mithril');
var helper = require('./helper');
var uuid = require('simple-uuid');
var store = require('store');

var Auth = function () {
  if (!(this instanceof Auth)) {
    return new Auth();
  }
};

Auth.prototype = Object.create(null);
Auth.prototype.constructor = Auth;

Auth.prototype.username = function (username) {
  if (username !== undefined) {
    store.set('username', username);
  }
  return store.get('username');
};

Auth.prototype.client = function () {
  var id = store.get('client');
  if (!id) {
    id = uuid();
    store.set('client', id);
  }
  return id;
};

Auth.prototype.token = function (token) {
  if (token !== undefined) {
    store.set('token', token);
  }
  return store.get('token');
};

Auth.prototype.clear = function () {
  store.remove('username');
  store.remove('token');
};

Auth.prototype.is = function () {
  return (this.username() && this.token());
};

/**
 * Check if api is accessable.
 *
 * @returns {boolean}
 */
Auth.prototype.needed = function () {
  m.request({});
};

Auth.prototype.signin = function (username, password) {
  var data = {
    username: username,
    client: this.client(),
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

Auth.prototype.signout = function () {
  var that = this;

  return m.request({
    url: helper.baseUrl('logout'),
    method: 'POST',
    config: function (xhr) {
//      dime.events.emit('authorize', xhr);
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

Auth.prototype.setup = function (xhr) {
  var result = false;
  if (this.is() && xhr && xhr.setRequestHeader) {
    xhr.setRequestHeader('Authorization', 'DimeTimetracker ' + [this.username(), this.client(), this.token()].join(','));
    result = true;
  }
  return result;
};

module.exports = new Auth();
