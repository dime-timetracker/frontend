'use strict'

const t = require('../../../../lib/translation')
const select = require('./select')

module.exports = (options, value) => {
  options = options || {}

  var values = [
    { value: true, htmlValue: 1, label: t('yes') },
    { value: false, htmlValue: 0, label: t('no') }
  ]

  return select({
    options: values,
    change: options.change,
    selected: (value === true) ? 1 : 0
  }, value)
}
