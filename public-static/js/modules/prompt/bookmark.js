;(function (dime, m, Mousetrap, t) {
  'use strict';

  var component = dime.modules.prompt.components.bookmark = {};

  component.controller = function () {
    var scope = {
      value: ''
    };

    var bookmark = component.find();
    if (!_.isUndefined(bookmark) && bookmark.value) {
      scope.value = bookmark.value;
    }

    return scope;
  };

  component.view = function (scope) {
    Mousetrap.bind('esc', component.close);

    return dime.core.views.dialog(
      m('p', m('input.form-control', {
        autofocus: 'autofocus',
        required: 'required',
        placeholder: t('Name your bookmark'),
        onkeyup: function (e) {
          component.name = e.target.value;
        },
        value: scope.value
      })),
      m('p.text-right', [
        m('button.btn.btn-flat.btn-alt[type=button]', { onclick: component.remove }, t('Remove')),
        m('button.btn.btn-flat.btn-alt[type=button]', { onclick: component.save }, t('Save')),
        m('button.btn.btn-flat.btn-alt[type=button]', { onclick: component.close }, t('Close'))
      ]),
      t('Bookmark filter') + ((component.value) ? ' "' + component.value + '"' : '')
    );
  };

  component.name = '';
  component.value = undefined;

  component.show = function (e) {
    m.mount(document.getElementById('modal'), component);
    return false;
  };

  component.close = function (e) {
    m.mount(document.getElementById('modal'), null);
    return false;
  };

  component.save = function (e) {
    if (!_.isEmpty(component.name) && !_.isEmpty(component.value)) {
      var bookmarks = component.list();

      var bookmark = _.find(bookmarks, { name: component.name });
      var idx = bookmarks.indexOf(bookmark);
      if (!_.isUndefined(bookmark)) {
        bookmark.name = component.name;
        bookmarks[idx] = bookmark;
      } else {
        bookmarks.push({ name: component.name, value: component.value });
      }
      
      dime.modules.setting.set('activity', 'filters', JSON.stringify(bookmarks));
      component.close();
    }
    return false;
  };

  component.remove = function (e) {
    var bookmarks = component.list();
    var idx = bookmarks.indexOf(component.find());
    if (-1 < idx) {
      bookmarks.splice(idx, 1);
      dime.modules.setting.set('activity', 'filters', JSON.stringify(bookmarks));
      component.close();
    }
    return false;
  };

  component.find = function (filter) {
    var bookmarks = component.list();
    if (!filter || !(filter.name || filter.value)) {
      filter = {};
      if (!_.isEmpty(component.name)) {
        filter.name = component.name;
      }
      if (!_.isEmpty(component.value)) {
        filter.value = component.value;
      }
    }
    return _.find(bookmarks, filter);
  };

  component.list = function () {
    var filters = JSON.parse(dime.modules.setting.get('activity', 'filters'));
    return _.isArray(filters) ? filters : [];
  };

  component.contains = function (value) {
    return 1 === component.list().filter(function(bookmark) {
      return bookmark.value === value;
    }).length;
  };

})(dime, m, Mousetrap, t);
