'use strict';

var m = require('mithril');
var t = require('../../translation');
var formatShortcut = require('../../core/helper').mousetrapCommand;
var debug = global.window.dimeDebug('shell.activity');
var parse = require('../../core/parser').parse;
var mousetrap = require('mousetrap');

function createActivity (e, scope) {
  var string = e.target.value;
  debug('Creating activity by ' + string);
  var activity = parse(string, ['customer', 'project', 'service', 'tags', 'times', 'description']);
  scope.addActivity(activity);
  e.target.value = '';
  e.target.blur();
}

function onKeyUp (e, scope) {
  var keyCode = e.which || e.keyCode;
  if (13 === keyCode) {
    createActivity(e, scope);
    e.target.blur();
  }
}

function inputView (scope) {
  return m('input.form-control.mousetrap', {
    id: scope.htmlId,
    placeholder: scope.placeholder,
    onfocus: scope.focus,
    onblur: scope.blur,
    onkeydown: scope.keydown,
    onkeyup: function (e) {
      onKeyUp(e, scope);
    }
  });
}

function registerMouseEvents (scope) {
  mousetrap(global.window).bind(scope.shortcut, function() {
    global.window.document.getElementById('shell').focus();
    return false;
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
  registerMouseEvents(scope);

  return scope;
}

function view (scope) {
  return m.component(require('../shell'), scope);
}

module.exports = {
  controller: controller,
  view: view
};
