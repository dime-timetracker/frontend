'use strict';

var m = require('mithril');
var t = require('../../lib/translation');
var formatShortcut = require('../../lib/helper/mousetrapCommand');
var debug = global.window.dimeDebug('shell.activity');
var parse = require('../../lib/parser').parse;
var shell = require('../shell');

function createActivity (e, scope) {
  var string = e.target.value;
  if (string) {
    var parsers = ['customer', 'project', 'service', 'tags', 'times', 'description'];
    debug('Creating activity by ' + string);
    var activity = parse(string, parsers);
    scope.addActivity(activity);
  }
  e.target.value = '';
  e.target.blur();
}

function inputView (scope) {
  return m('input.form-control.mousetrap', {
    id: scope.htmlId,
    placeholder: scope.placeholder,
    onfocus: scope.focus,
    onblur: scope.blur,
    onkeydown: scope.keydown,
  });
}

function controller (listScope) {
  var scope = {
    shortcut: 'd a',
    icon: 'icon-play-arrow',
    htmlId: 'shell',
    addActivity: function (activity) {
      listScope.collection.persist(activity);
    }
  };
  scope.placeholder = ' ' + t('shell.activity.placeholder', {
    shortcut: formatShortcut(scope.shortcut)
  });
  scope.inputView = function () {
    return inputView(scope);
  };
  scope.onSubmit = function (e) {createActivity(e, scope);};
  scope.blur = function (e) {shell.blur(e, scope);};
  scope.focus = function (e) {shell.focus(e, scope);};
  shell.registerMouseEvents(scope);

  return scope;
}

function view (scope) {
  return m.component(shell, scope);
}

module.exports = {
  controller: controller,
  view: view
};
