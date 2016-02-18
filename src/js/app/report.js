'use strict';

var m = require('mithril');
var t = require('../lib/translation');
var cardView = require('./utils/views/card/default');
var shellFilter = require('./shell/filter');

function itemView (scope, timeslice) {
  return m('tr.timeslice', [
    m('td.activity.description', timeslice.activity.description),
    m('td.activity.customer', timeslice.activity.customer ? timeslice.activity.customer.name : ''),
    m('td.activity.project', timeslice.activity.project ? timeslice.activity.project.name : ''),
    m('td.activity.service', timeslice.activity.service ? timeslice.activity.service.name : ''),
    m('td.startedAt', timeslice.startedAt),
    m('td.stoppedAt', timeslice.stoppedAt)
  ]);
}

function headerView (scope) {
  return m('thead', m('tr', [
    m('th.description', t('description')),
    m('th.customer', t('customer')),
    m('th.project', t('project')),
    m('th.service', t('service')),
    m('th.startedAt', t('report.table.header.startedAt')),
    m('th.stoppedAt', t('report.table.header.stoppedAt')),
  ]));
}

function controller () {
  var scope = {
    collection: timesliceCollection,
    query: decodeURIComponent((m.route.param('query')+'').replace(/\+/g, '%20'))
  };
  scope.collection.initialize({
    filter: scope.query
  });

  return scope;
}

function view (scope) {
  return m('.report', [
    m('.query', cardView(m.component(shellFilter, scope))),
    m('.table-responsive',
      m('table.table', [
        headerView(scope),
        m('tbody',
          scope.collection.map(function(timeslice) {
            return itemView(scope, timeslice);
          })
        )
      ])
    )
  ]);
}

module.exports = {
  controller: controller,
  view: view
};
