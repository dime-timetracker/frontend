'use strict';

var m = require('mithril');
var timesliceCollection = require('../lib/collection/timeslices');

function itemView (timeslice) {
  return m('.timeslice', [
    m('.activity', [
      m('.description', timeslice.activity.description),
      m('.customer', timeslice.activity.customer ? timeslice.activity.customer.name : ''),
      m('.project', timeslice.activity.project ? timeslice.activity.project.name : ''),
      m('.service', timeslice.activity.service ? timeslice.activity.service.name : ''),
    ]),
    m('.startedAt', timeslice.startedAt),
    m('.stoppedAt', timeslice.stoppedAt)
  ]);
}

function controller () {
  var scope = {
    collection: timesliceCollection
  };
  scope.collection.fetch({
    requestAttributes: {
      filter: m.route.param('query')
    }
  });

  return scope;
}

function view (scope) {
  return m('.report', [
    m('.query', scope.query),
    m('.table', 
      scope.collection.map(itemView)
    )
  ]);
}

module.exports = {
  controller: controller,
  view: view
};
