'use strict'

const codemirror = require('src/lib/codemirror')
const m = require('src/lib/mithril')
const t = require('src/lib/translation')

/**
 * Statistics input field
 *
 * @param  {Object} options
 * @param  {JSON Array|Array} value
 * @return {VirtualElement} input field
 */
module.exports = function (options, value) {
  options = options || {}

  if (typeof value === 'string') {
    value = JSON.parse(value)
  }
  if (value === null || value === undefined) {
    value = options.value || []
  }

  function onchange () {
    options.change(JSON.stringify(value.filter(x => x)))
  }

  return m('.form-control.statistics', [
    value.filter(x => x).map((item, idx) => m('.statisticsItem', [
      m('label.item-label', [
        m('.title', t('config.activity.statistics.property.label')),
        m('input', {
          onchange: (e) => {
            e.preventDefault()
            value[idx].label = e.target.value
            onchange()
          },
          value: item.label || ''
        })
      ]),
      m('label.item-filter', [
        m('.title', t('config.activity.statistics.property.filter')),
        m('input', {
          onchange: (e) => {
            e.preventDefault()
            value[idx].filter = e.target.value
            onchange()
          },
          value: item.filter || ''
        })
      ]),
      m('label.item-target', [
        m('.title', t('config.activity.statistics.property.target')),
        m('input[type=numeric]', {
          onchange: (e) => {
            e.preventDefault()
            value[idx].target = e.target.value
            onchange()
          },
          value: item.target || ''

        })
      ]),
      m('label.item-aggregator', [
        m('.title', t('config.activity.statistics.property.aggregator')),
        m.component(codemirror, {
          onchange: (instance, object) => {
            value[idx].aggregator = instance.doc.getValue()
            onchange()
          },
          value: m.prop(item.aggregator || '')
        })
      ]),
      m('label.item-formatter', [
        m('.title', t('config.activity.statistics.property.formatter')),
        m.component(codemirror, {
          onchange: (instance, object) => {
            value[idx].formatValue = instance.doc.getValue()
            onchange()
          },
          value: m.prop(item.formatValue || '')
        })
      ]),
      m('button.item-remove', {
        onclick: (e) => {
          e.preventDefault()
          delete value[idx]
          onchange()
        }
      }, t('config.activity.statistics.item-remove'))
    ])),
    m('button.item-add', {
      onclick: (e) => {
        e.preventDefault()
        value.push({})
        onchange()
      }
    }, t('config.activity.statistics.item-add'))
  ])
}
