/*
 * Configuration object pattern:
 *
 * {
 *   foo: {
 *     title: 'Tab Foo',
 *     weight: 0
 *     children: {
 *       bar: {
 *         title: 'Section Bar',
 *         weight: 0
 *         children: {
 *           baz: {
 *             title: 'Item Baz',
 *             description: 'Foo bar baz',
 *             onRead: function(value, namespace, name) {},
 *             onWrite: function(value, oldValue, namespace, name) {},
 *             defaultValue: 'Default value',
 *             display: function(namespace, name) { return true; },
 *             type: 'number'
 *           }
 *         }
 *       }
 *     }
 *   },
 *   boo: {...}
 * }
 */

;(function (dime, _, m) {
  'use strict';
  
  var t = dime.translate;

  var headerWithDescription = function (setting) {
    var header = [t(setting.title)];
    if (setting.description) {
      header.push(m('span.help', t(setting.description)));
    }
    return header;
  };

  dime.modules.setting = {
    controller: function () {
      var scope = {};

      return scope;
    },
    views: {
      card: function (section) {
        var content = [m('h2.content-sub-heading', headerWithDescription(section))];

        // sections
        var children = [];
        _.forOwn(section.children, function (value, ckey) {
          children.push(m('p.card-heading', headerWithDescription(value)));
          
          _.forOwn(value.children, function (v) {
            children.push(dime.modules.setting.views.form(v));
          });
        });
        content.push(m('div.card', m('div.card-main', m('.card-inner', children))));

        return content;
      },
      form: function (current) {
        if (_.isFunction(current.onRender) && false === current.onRender()) {
          return null;
        }
        var type = current.type ? current.type : 'text';
        var onchange = function(value) {
          if (_.isFunction(current.onWrite)) {
            value = current.onWrite(value);
          }
          dime.modules.setting.set(current.namespace, current.name, value);
        };
        var value = dime.modules.setting.get(current.namespace, current.name, current.defaultValue);
        if (_.isFunction(current.onRead)) {
          value = current.onRead(value);
        }
        var input = m('input', {
          type: type,
          value: value,
          onchange: function (e) { onchange(e.target.value); }
        });
        if (dime.inputs[type]) {
          input = dime.inputs[type](current, value, onchange);
        }

        return m('p.row.form-group#setting-' + current.namespace + '/' + current.name, [
          m('.col-md-3', t(current.title)),
          m('.col-md-9', [input, m('span.form-help', t(current.description))])
        ]);
      }
    },
    view: function() {
      var content = [];

      _.forOwn(dime.settings, function (value) {
        content.push(dime.modules.setting.views.card(value));
      });

      return content;
    }
  };

  var getSetting = function (namespace, name) {
    var filter = { namespace: namespace, name: name };
    return dime.resources.setting.find(filter) || filter;
  };

  dime.modules.setting.get = function (namespace, name, defaultValue) {
    if (_.isObject(namespace)) {
      defaultValue = namespace.defaultValue;
      name = namespace.name;
      var namespace = namespace.namespace;
    }
    var setting = getSetting(namespace, name);
    if (false === _.isUndefined(setting.value)) {
      return setting.value;
    }
    return (_.isUndefined(defaultValue)) ? null : defaultValue;
  };

  dime.modules.setting.set = function (namespace, name, value) {
    if (_.isObject(namespace)) {
      value = name;
      name = namespace.name;
      var namespace = namespace.namespace;
    }
    var setting = getSetting(namespace, name);
    setting.value = value;
    dime.resources.setting.persist(setting);
  };

  // transient store for temporary settings
  dime.modules.setting.local = {};

  // register route
  dime.routes['/setting'] = dime.modules.setting;

  // register schema
  dime.resources.setting = new Resource({
    url: dime.apiUrl + 'setting',
    model: dime.modules.setting.model
  });
  dime.resources.setting.fetch();

  // add menu item
  dime.menu.filter(function(item) { return item.id === 'administration'; })[0].children.push({
    id: 'settings',
    route: '/setting',
    name: t('Settings'),
    weight: 100
  });
  
})(dime, _, m)
