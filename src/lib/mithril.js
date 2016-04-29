'use strict'

module.exports = require('mithril')

if (undefined !== global.window && global.window.location.search.indexOf('mdebug') > 0) {
  module.exports = require('mithril-source-hint')
}
