'use strict'

const m = require('mithril')

const authorize = require('./lib/authorize')
const baseUrl = require('./lib/helper/baseUrl')()
const extractXhrPagination = require('./lib/helper/extractXhrPagination')

function persist (resource, data, options) {
  options = options || {}
  // Request configuration
  var configuration = {
    method: 'POST',
    url: baseUrl + '/api/' + resource,
    initialValue: data,
    data: data,
    config: function (xhr) {
      authorize.setup(xhr)
    }
  }
  if (data[options.idAttribute || 'id']) {
    configuration.url += '/' + data[options.idAttribute || 'id']
    configuration.method = 'PUT'
  }

  return m.request(configuration)
}

function fetchBunch (resource, options) {
  return m.request({
    method: 'GET',
    url: baseUrl + '/api/' + resource,
    config: function (xhr) {
      authorize.setup(xhr)
    },
    extract: function (xhr) {
      if (xhr.status === 401) {
        m.route('/login')
      }
      options.pagination = extractXhrPagination(xhr)
      return xhr.responseText
    }
  })
}

module.exports = {
  persist: persist,
  fetchBunch: fetchBunch
}
