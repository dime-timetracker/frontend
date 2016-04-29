'use strict'

const m = require('src/lib/mithril')
const debug = require('debug')('api')

const authorize = require('../lib/authorize')
const baseUrl = require('../lib/helper/baseUrl')()
const extractXhrPagination = require('../lib/helper/extractXhrPagination')
const reduce = require('lodash/collection/reduce')

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
  let url = options.url
  if (!url) {
    url = baseUrl + '/api/' + resource

    let parameters = options.parameters || {}
    if (options.with) {
      parameters.with = options.with
    }
    if (parameters !== {}) {
      url += reduce(parameters, (query, value, key) => query + key + '=' + value + '&', '?')
    }
  }
  return m.request({
    method: 'GET',
    url: url,
    config: function (xhr) {
      authorize.setup(xhr)
    },
    extract: function (xhr) {
      if (xhr.status === 401) {
        m.route('/login')
      } else {
        options.pagination = extractXhrPagination(xhr)
        debug('paginating ' + resource, options.pagination)
      }
      return xhr.responseText
    }
  })
}

function remove (resource, id) {
  return m.request({
    method: 'DELETE',
    url: baseUrl + '/api/' + resource + '/' + id,
    config: function (xhr) {
      authorize.setup(xhr)
    }
  })
}

module.exports = {
  persist: persist,
  fetchBunch: fetchBunch,
  remove: remove
}
