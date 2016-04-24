'use strict';

var extend = require('lodash/object/extend');
var t = require('../translation');

/**
 * Format number as currency.
 *
 * Example:
 *
 * currency(3.23, '€ {number}') => '€ 3,23'
 *
 * @param {Number} amount
 * @param {String} pattern
 * @returns {String}
 */
var currency = function (amount, options, locales) {
  options = extend({style: 'currency', currency: t('default.currency')}, options);
  return amount.toLocaleString(locales, options);
};

module.exports = currency;
