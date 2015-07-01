'use strict';

var m = require('mithril');
var _ = require('lodash');
var moment = require('moment');
var env = require('./env');
var t = require('../translation');

var helper = {};

/**
 * Format number as currency.
 * 
 * @param {Number} amount
 * @param {String} pattern
 * @returns {String}
 */
helper.currency = function (amount, pattern) {
  pattern = pattern || '€ {number}';

  var DecimalSeparator = Number("1.2").toLocaleString().substr(1, 1);
  var AmountWithCommas = amount.toLocaleString();
  var arParts = String(AmountWithCommas).split(DecimalSeparator);
  var intPart = arParts[0];
  var decPart = (arParts.length > 1 ? arParts[1] : '');
  decPart = (decPart + '00').substr(0, 2);

  var number = intPart + DecimalSeparator + decPart;
  return pattern.replace('{number}', number);
};

/**
 * Format duration.
 * 
 * @param {Number} data
 * @param {String} unit base unit of data
 * @returns {String}
 */
helper.duration = function (data, unit) {
  if (data !== undefined && _.isNumber(data)) {
    unit = unit || 'seconds';
    var duration = moment.duration(data, unit);

    var hours = Math.floor(duration.asHours()),
            minute = duration.minutes(),
            second = duration.seconds();

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minute < 10) {
      minute = '0' + minute;
    }
    if (second < 10) {
      second = '0' + second;
    }

    return [hours, minute, second].join(':');
  }
  return '';
};

helper.mousetrapCommand = function (command) {
  if (global.navigator.appVersion.indexOf("Mac") !== -1) {
    command = command.replace('mod', t('command'));
  } else {
    command = command.replace('mod', t('ctrl'));
  }
  command = command.replace('shift', t('shift'));
  command = command.replace('alt', t('alt'));
  return command;
};

/**
 * Uppercase the first letter of a string.
 * @param {String} text
 * @returns {String}
 */
helper.ucFirst = function (text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 *
 * @param {type} path
 * @param {type} parameters
 * @returns {String}
 */
helper.buildUrl = function (path, parameters) {
  var result = [];

  if (path) {
    result.push(helper.baseUrl.apply(this, path));
  }

  if (_.isPlainObject(parameters)) {
    result.push(helper.urlParameters(parameters));
  }

  return result.join('?');
};

/**
 * concatenates arguments to base url, divided by slash
 *
 * Example:
 *
 * helper.baseUrl('api', 'customer') => /base/url/api/customer
 * 
 * @returns {String}
 */
helper.baseUrl = function () {
  var uri = [];
  var contain = false;

  for (var i = 0; i < arguments.length; i++) {
    if (env.baseUrl
            && _.isString(arguments[i])
            && arguments[i].indexOf(env.baseUrl) !== -1) {
      contain = true;
    }
    uri.push(arguments[i]);
  }

  if (!contain && env.baseUrl) {
    uri.unshift(env.baseUrl);
  }

  return uri.join('/');
};

/**
 * Concatenates and encode parameter object, divided by ampersand.
 * 
 * @param {Object} parameters
 * @returns {String}
 */
helper.urlParameters = function (parameters) {
  var result = [];
  if (_.isPlainObject(parameters)) {
    _.forOwn(parameters, function pushToResult(value, key)  {
      if (!_.isUndefined(value)) {
        result.push(key + '=' + encodeURI(value));
      }
    });
  }
  return result.join('&');
};

module.exports = helper;