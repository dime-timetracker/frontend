'use strict'

const extend = require('lodash/object/extend')
const t = require('src/lib/translation')

/**
 * Format number as currency.
 *
 * @param float amount   amount to be formatted
 * @param object options e.g. { currency: "EUR" }
 * @param string locales e.g. "de-DE"
 *
 * @returns {String}
 */
const currency = function (amount, options, locales) {
  options = extend({style: 'currency', currency: t('default.currency')}, options)
  const result = amount.toLocaleString(locales, options)
  console.log(amount + '.toLocaleString("' + locales + '", ' + JSON.stringify(options) + ')', result)
  return result
}

module.exports = currency
