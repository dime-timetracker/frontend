'use strict';

(function (dime, m, _) {

  dime.modules.customer.views.form = function (current, allowDelete, onSave) {
    allowDelete = _.isUndefined(allowDelete) ? true : allowDelete;
    var disabled = current.enabled ? '' : '.disabled';

    var saveForm = function (e) {
      dime.resources.customer.persist(current);
      if (_.isFunction(onSave)) {
        onSave(current);
      }
    };

    var rows = [
      m("dt.name", "Name"),
      m("dd.name", {
        contenteditable: true,
        oninput: function (e) {
          current.name = e.target.textContent;
        },
      }, current.name),
      m("dt.alias", "Alias"),
      m("dd.alias", {
        contenteditable: true,
        oninput: function (e) {
          current.alias = e.target.textContent;
        },
      }, current.alias),
      m("dt.enabled", "enabled"),
      m("dd.enabled", [
        m("input[type=checkbox]", {
          checked: current.enabled,
          oninput: function (e) {
            current.enabled = e.target.checked;
          },
        })
      ])
    ];

    if (allowDelete) {
      rows.push(
        m("input[type=submit].delete", {
          onclick: function() { confirm('Really?') && current.delete(current.id) },
          value: 'Delete'
        })
      );
    }

    rows.push(
      m("input[type=submit].save", {
        onclick: saveForm,
        value: 'Save'
      })
    );

    return m('dl' + disabled, rows);
  }

})(dime, m, _);
