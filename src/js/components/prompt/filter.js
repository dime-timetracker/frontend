'use strict';

var m = require('mithril');
var t = require('../../translation');
var formatShortcut = require('../../core/helper').mousetrapCommand;

function buttonReportView (scope) {
  return m('.media-object.pull-right',
    m('a[href="/report"].form-icon-label', {
      config: m.route
    }, m('span.icon.icon-print'))
  );
}

function buttonBookmarkView (scope) {
  return m('.media-object.pull-right',
    m('span.form-icon-label', {
      onclick: function () {
        console.error('TODO: bookmark');
      }
    }, m('span.icon.icon-bookmark' + (scope.isBookmarked ? '' : '-outline')))
  );
}

function inputView (scope) {
  return m('input#prompt.form-control.mousetrap', {
    placeholder: t('prompt.filter.placeholder', {
      shortcut: formatShortcut(scope.shortcut)
    }),
    onfocus: scope.focus,
    onblur: scope.blur,
    onkeydown: scope.keydown,
    onkeyup: function(e) {
      console.log('FIXME: update bookmark icon');
    }
  });
}
    
module.exports = {
  controller: function (parentScope) {
    var scope = {
      shortcut: 'mod-f',
    };
    //TODO trigger Mousetrap

    return scope;
  },
  view: function (scope) {
    return m('.media', [
      m('.media-object.pull-left',
        m('label.form-icon-label', {
          for: 'filter'
        }, m('span.icon.icon-filter-list'))
      ),
      buttonReportView(scope),
      buttonBookmarkView(scope),
      m('.media-inner', inputView(scope))
    ]);
  }
};
