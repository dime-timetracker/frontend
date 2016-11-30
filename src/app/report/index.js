'use strict'

const activityApi = require('src/api/activity')
const cardView = require('src/app/utils/views/card/default')
const customerApi = require('src/api/customer')
const debug = require('debug')('app.report')
const duration = require('src/app/timeslice').duration
const m = require('src/lib/mithril')
const moment = require('moment')
const projectApi = require('src/api/project')
const tagApi = require('src/api/tag')
const serviceApi = require('src/api/service')
const settingsApi = require('src/api/setting')
const shellFilter = require('src/app/shell/filter')
const shellMerger = require('src/app/shell/merger')
const itemValues = require('./item').values
const itemView = require('./item').view
const t = require('src/lib/translation')
const timesliceApi = require('src/api/timeslice')
const totalsView = require('./totals').view
const userSettings = require('src/app/setting').sections
userSettings.report = require('./settings')

function headerView (columns) {
  return m('thead', m('tr', columns.map(col => m('th.' + col, t('report.table.header.' + col)))))
}

function getFilterOptions (customers, projects, services, tags) {
  return function (query) {
    const parsers = ['customer', 'project', 'service', 'tags', 'filterTimes', 'description']
    const filters = require('src/lib/parser').parse(query, parsers)
    const options = { parameters: {} }
    if (filters.customer) {
      let customer = customers.find((customer) => customer.alias === filters.customer.alias)
      if (customer) {
        options.parameters['by[customer]'] = customer.id
      }
    }
    if (filters.project) {
      let project = projects.find((project) => project.alias === filters.project.alias)
      if (project) {
        options.parameters['by[project]'] = project.id
      }
    }
    if (filters.service) {
      let service = services.find((service) => service.alias === filters.service.alias)
      if (service) {
        options.parameters['by[service]'] = service.id
      }
    }
    if (filters.description) {
      options.parameters['by[search]'] = '%' + filters.description + '%'
    }
    if (filters.filterStart || filters.filterStop) {
      let start = filters.filterStart ? moment(filters.filterStart).format('YYYY-MM-DD') : null
      let stop = filters.filterStop ? moment(filters.filterStop).format('YYYY-MM-DD') : null
      options.parameters['by[date]'] = (start || '') + ';' + (stop || '')
    }
    return options
  }
}

function columnSelectionView (columns) {
  const availableColumns = [
    'description',
    'customer',
    'project',
    'service',
    'tags',
    'started_at',
    'stopped_at',
    'duration',
    'price'
  ].reverse()
  return m('.columns-selection.row', availableColumns.map(currentCol => m('.column.pull-right.' + currentCol, [
    m('input#enable_column_' + currentCol + '[type=checkbox]', {
      checked: columns().indexOf(currentCol) > -1,
      onchange: (e) => {
        const enabledColumns = columns()
        columns(availableColumns.filter(col => {
          if (currentCol === col) {
            return e.target.checked
          }
          return enabledColumns.indexOf(col) > -1
        }).reverse())
      }
    }),
    m('label[for=enable_column_' + currentCol + ']', t('report.table.header.' + currentCol))
  ])))
}

function onFetch (customers, projects, services, tags) {
  return function (scope, options) {
    Promise.all([
      activityApi.fetchAll(options),
      timesliceApi.fetchAll(options)
    ]).then(function ([activities, timeslices]) {
      debug('filtered activities', activities)
      scope.collection(timeslices.map(timeslice => {
        const activity = activities.find((activity) => (activity.id === timeslice.activity_id))
        if (activity) {
          timeslice.activity = activity
          timeslice.activity.customer = customers.find((customer) => (
            customer.id === timeslice.activity.customer_id
          ))
          timeslice.activity.project = projects.find((project) => (
            project.id === timeslice.activity.project_id
          ))
          timeslice.activity.service = services.find((service) => (
            service.id === timeslice.activity.service_id
          ))
          timeslice.tags = timeslice.activity.tags
            .map(tagId => tags.find(tag => tag.id === tagId))
          return timeslice
        }
      }).filter(timeslice => timeslice))
      prepareCollection(scope)
    })
  }
}

function prepareCollection (scope) {
  let rows = JSON.parse(JSON.stringify(scope.collection())).map(row => {
    row.duration = duration(row, userSettings.find('report.precision'))
    if (row.duration && row.activity.project && row.activity.project.rate) {
      row.price = moment.duration(row.duration, 'seconds').asHours() * row.activity.project.rate
    }
    return row
  })
  if (!scope.customMergeCode) {
    debug('no custom merger')
    scope.rows(rows)
    m.redraw()
    return
  }
  try {
    debug('running custom merger')
    rows = eval(scope.customMergeCode()) || []
    if (Array.isArray(rows) === false) {
      debug('This should have been an array:', rows)
      return
    }
  } catch (e) {
    debug('error running custom merger', e)
    return
  }
  scope.rows(rows)
  m.redraw()
}

function isSingleCustomer (rows) {
  let customerCount = 0
  let customerAlias
  rows.forEach((row, rowNo) => {
    if (customerAlias !== (row.activity.customer ? '@' + row.activity.customer.alias : rowNo)) {
      customerCount++
      customerAlias = '@' + row.activity.customer.alias
    }
  })
  return customerCount === 1
}

/**
 * get parameters for invoice creation
 *
 * @param object config  Invoice configuration, including incrementNo, sender, taxRate
 * @param array  columns Column headers
 * @param array  rows    Invoice items
 *
 * @return array
 */
function getInvoiceParams (config, columns, rows) {
  const rowWithCustomer = rows.find(row => row.activity && row.activity.customer)
  if (!rowWithCustomer) {
    throw new Error('report.invoice.error.no-customer')
  }
  const params = {
    columns: {},
    date: config.date,
    footer: config.footer,
    increment_no: config.incrementNo,
    intro: config.intro,
    outro: config.outro,
    receiver: rowWithCustomer.activity.customer.address,
    rows: [],
    sender: config.sender,
    subject: config.subject
  }
  columns.map(col => { params.columns[col] = t('report.table.header.' + col) })
  params.rows = rows.map(row => itemValues(columns, row)).map((row) => {
    return row.reduce((rowData, row) => {
      rowData[row.code] = row.value
      return rowData
    }, {})
  })
  const subtotal = rows.reduce((sum, row) => {
    if (row.activity.customer && row.activity.customer.address !== params.receiver) {
      throw new Error('report.invoice.error.altering-customers')
    }
    return sum + row.activity.project.rate * row.duration / 3600
  }, 0)
  const tax = subtotal * parseFloat(config.taxRate) / 100
  const grandTotal = subtotal + tax
  params.totals = {
    subtotal: { title: t('invoice.totals.subtotal'), value: subtotal.toFixed(2) + ' €' },
    tax: { title: t('invoice.totals.tax'), value: tax.toFixed(2) + ' €' },
    grand_total: { title: t('invoice.totals.grand_total'), value: grandTotal.toFixed(2) + ' €' }
  }
  return params
}

function controller () {
  const query = m.route.param('query') + ''
  const scope = {
    collection: m.prop([]),
    columns: m.prop([
      'description',
      'customer',
      'project',
      'service',
      'tags',
      'duration',
      'price'
    ]),
    query: decodeURIComponent(query.replace(/\+/g, '%20')),
    onSubmitFilter: function () {},
    customMergeCode: m.prop('[]'),
    rows: m.prop([])
  }
  scope.customMergeCodeExamples = {
    groupByActivity: `rows.reduce((result, row) => {
  if (undefined === result[row.activity.id]) {
    result[row.activity.id] = row
  } else {
    result[row.activity.id].duration += row.duration
    if (row.started_at < result[row.activity.id].started_at) {
      result[row.activity.id].started_at = row.started_at
    }
  }
  if (result[row.activity.id].stopped_at < row.stopped_at) {
    result[row.activity.id].stopped_at = row.stopped_at
  }
  return result
}, [])`
  }
  scope.customMergeCode(scope.customMergeCodeExamples.groupByActivity)
  scope.updateMergeCode = function (code) {
    scope.customMergeCode(code)
    prepareCollection(scope)
  }
  prepareCollection(scope)
  Promise.all([
    customerApi.getCollection(),
    projectApi.getCollection(),
    serviceApi.getCollection(),
    tagApi.getCollection()
  ]).then(function ([customers, projects, services, tags]) {
    const filter = getFilterOptions(customers, projects, services, tags)
    const fetch = onFetch(customers, projects, services, tags)
    scope.onSubmitFilter = function (query) {
      fetch(scope, filter(query))
    }
    debug('Registered filter submit event')
    scope.onSubmitFilter(scope.query)
  })

  scope.invoiceParams = m.prop({
    date: (new Date()).toLocaleDateString(),
    incrementNo: userSettings.find('report.invoice.incrementNo') || t('invoice.form.incrementNo.default'),
    intro: userSettings.find('report.invoice.intro') || t('invoice.form.intro.default'),
    outro: userSettings.find('report.invoice.outro') || t('invoice.form.outro.default'),
    sender: userSettings.find('report.invoice.sender') || '',
    subject: userSettings.find('report.invoice.subject') || t('invoice.form.subject.default'),
    taxRate: userSettings.find('report.invoice.taxRate') || t('invoice.form.taxRate.default'),
    footer: {
      left: { 'name': userSettings.find('report.invoice.footer.companyName') },
      center: { 'taxId': userSettings.find('report.invoice.footer.taxId') },
      right: { 'bank-account': userSettings.find('report.invoice.footer.iban') }
    }
  })

  scope.printInvoice = function (e) {
    const invoiceParams = scope.invoiceParams()
    settingsApi.persistConfig('report.invoice.incrementNo', invoiceParams.incrementNo)
    settingsApi.persistConfig('report.invoice.intro', invoiceParams.intro)
    settingsApi.persistConfig('report.invoice.outro', invoiceParams.outro)
    settingsApi.persistConfig('report.invoice.subject', invoiceParams.subject)
    invoiceParams.subject = invoiceParams.subject.replace('{incrementNo}', invoiceParams.incrementNo)
    e.target.form.querySelector('input[name=invoice]').value = JSON.stringify(
      getInvoiceParams(scope.invoiceParams(), scope.columns(), scope.rows().filter(row => row))
    )
    e.target.form.submit()
  }

  return scope
}

function invoiceFormView (scope) {
  const invoiceParams = scope.invoiceParams()

  const updateInvoiceParam = (field, value) => {
    invoiceParams[field] = value
    scope.invoiceParams(invoiceParams)
  }

  return m('form.invoice[method=POST]', { target: '_invoice', action: 'invoice/html' }, [
    m('input[type=hidden]', { name: 'invoice', value: JSON.stringify(invoiceParams) }),
    m('label[for=invoice-subject]',
      t('invoice.form.subject.label'),
      m('input.subject', {
        onchange: e => updateInvoiceParam('subject', e.target.value),
        value: invoiceParams.subject
      })
    ),
    m('label[for=invoice-incrementNo]', [
      t('invoice.form.incrementNo.label'),
      m('input#invoice-incrementNo', {
        onchange: e => updateInvoiceParam('incrementNo', e.target.value),
        value: invoiceParams.incrementNo
      })
    ]),
    m('label[for=invoice-date]', [
      t('invoice.form.date.label'),
      m('input#invoice-date', {
        onchange: e => updateInvoiceParam('date', e.target.value),
        value: invoiceParams.date
      })
    ]),
    m('label[for=invoice-intro]', [
      t('invoice.form.intro.label'),
      m('textarea#invoice-intro', {
        onchange: e => updateInvoiceParam('intro', e.target.value),
        value: invoiceParams.intro
      })
    ]),
    m('label[for=invoice-outro]', [
      t('invoice.form.outro.label'),
      m('textarea#invoice-outro', {
        onchange: e => updateInvoiceParam('outro', e.target.value),
        value: invoiceParams.outro
      })
    ]),

    m('button.btn.green', { onclick: scope.printInvoice }, t('invoice.form.create.button'))
  ])
}

function view (scope) {
  const columns = scope.columns()
  const rows = scope.rows()
  debug('rendering list', rows.map(row => row.duration), columns)
  return m('.report', [
    m('.query.filter', cardView(m.component(shellFilter, scope))),
    m('.query.merger', cardView(m.component(shellMerger, {
      current: scope.customMergeCode,
      examples: scope.customMergeCodeExamples,
      update: scope.updateMergeCode
    }))),
    columnSelectionView(scope.columns),
    m('.table-responsive',
      m('table.table', [
        headerView(columns),
        m('tbody',
          rows.map((row) => itemView({ item: row, key: row.id, columns: columns }))
        ),
        totalsView({ rows: rows, columns: columns })
      ])
    ),
    isSingleCustomer(rows) ? invoiceFormView(scope) : null
  ])
}

module.exports = { controller, getFilterOptions, view, prepareCollection, columnSelectionView, getInvoiceParams }
