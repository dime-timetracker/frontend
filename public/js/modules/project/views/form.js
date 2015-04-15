'use strict';

(function (dime, m, _) {

  dime.modules.project.views.form = function (current, allowDelete, onSave) {
    allowDelete = _.isUndefined(allowDelete) ? true : allowDelete;
    var disabled = current.enabled ? '' : '.disabled';

    var saveForm = function (e) {
      dime.resources.project.persist(current);
      if (_.isFunction(onSave)) {
        onSave(current);
      }
    };

    var rows = m(".form-rows", [
      m(".form-row.name", [
        m("label", "Name"),
        m("input", {
          value: current.name,
          onchange: function (e) {
            current.name = e.target.value;
          }
        })
      ]),
      m(".form-row.alias", [
        m("label", "Alias"),
        m("input", {
          value: current.alias,
          onchange: function (e) {
            current.alias = e.target.value;
          }
        })
      ]),
      m(".form-row.rate", [
        m("label", "Rate"),
        m("input", {
          value: current.rate,
          type: 'number',
          onchange: function (e) {
            current.rate = e.target.value;
          }
        })
      ]),
      m(".form-row.enabled", [
        m("label", "enabled"),
        m("input", {
          value: true,
          checked: current.enabled,
          type: 'checkbox',
          onchange: function (e) {
            current.enabled = e.target.value;
          }
        })
      ])
    ]);
    dime.events.emit('project-form-rows-view-after', {view: rows, project: current});

    if (allowDelete) {
      rows.children.push(
        m("input[type=submit].delete", {
          onclick: function() { confirm('Really?') && current.delete(current.id) },
          value: 'Delete'
        })
      );
    }

    rows.children.push(
      m("input[type=submit].save", {
        onclick: saveForm,
        value: 'Save'
      })
    );

    return m('form' + disabled, rows);
  }

})(dime, m, _);
