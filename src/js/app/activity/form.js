var m = require('mithril')
var form = require('../crud/form')

module.exports = (scope) => m.component(form, {
  key: 'form-' + scope.activity.uuid,
  model: scope.activity,
  onCancel: scope.onCancel,
  onDelete: scope.onDelete,
  onSubmit: scope.onSubmit,
  properties: [
    { key: 'description' },
    { key: 'customer', type: 'relation', collection: scope.customers },
    { key: 'project', type: 'relation', collection: scope.projects },
    { key: 'service', type: 'relation', collection: scope.services },
    { key: 'rate', type: 'number' }
  ]
})
