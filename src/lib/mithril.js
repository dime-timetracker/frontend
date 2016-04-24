'use strict'

module.exports = require('mithril')

if (window.location.search.indexOf('mdebug') > 0) {
  module.exports = require('mithril-source-hint')
}
