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
        var content = [];
        // sections
        var children = [];
        _.forOwn(section.children, function (value, ckey) {
          children.push(m('p.card-heading', headerWithDescription(value)));
          
          _.forOwn(value.children, function (v) {
            children.push(dime.modules.setting.views.form(v));
          });
        });
        if (children.length > 0) {
          content.push(m('h2.content-sub-heading', headerWithDescription(section)));
          content.push(m('div.card', m('div.card-main', m('.card-inner', children))));
        }
        return content;
      },
      form: function (current) {
        if (_.isFunction(current.onRender) && false === current.onRender()) {
          return null;
        }
        var type = current.type ? current.type : 'text';
        var update = function(value) {
          if (_.isFunction(current.onWrite)) {
            value = current.onWrite(value);
          }
          dime.configuration.set(current.namespace, current.name, value);
        };
        var value = dime.configuration.get(current.namespace, current.name, current.defaultValue);
        if (_.isFunction(current.onRead)) {
          value = current.onRead(value);
        }
        var input;
        if (dime.core.views.inputs[type]) {
          input = dime.core.views.inputs[type](value, update, type);
        } else {
          input = dime.core.views.inputs.input(value, update, type);
        }

        return m('p.row.form-group#setting-' + current.namespace + '/' + current.name, [
          m('.col-md-3', t(current.title)),
          m('.col-md-9', [input, m('span.form-help', t(current.description))])
        ]);
      }
    },
    view: function() {
      var content = [];

      _.forOwn(dime.configuration, function (value) {
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

  // add menu item
  dime.menu.push({
    id: 'settings',
    route: '/setting',
    name: 'Settings',
    icon: 'icon-settings',
    weight: 100
  });
 
})(dime, _, m)
