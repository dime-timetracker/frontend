'use strict';

(function (dime, m, _) {

  dime.modules.project.views.form = function (current, allowDelete) {
    allowDelete = _.isUndefined(allowDelete) ? true : allowDelete;
    var disabled = current.enabled ? '' : '.disabled';

    var rows = [
      m("dt.name", "Name"),
      m("dd.name", {
        contenteditable: true,
        oninput: function (e) {
          current.name = e.target.textContent;
          dime.resources.project.persist(current);
          m.redraw();
        },
      }, current.name),
      m("dt.alias", "Alias"),
      m("dd.alias", {
        contenteditable: true,
        oninput: function (e) {
          current.alias = e.target.textContent;
          dime.resources.project.persist(current);
          m.redraw();
        },
      }, current.alias),
      m("dt.rate", "Rate"),
      m("dd.rate", {
        contenteditable: true,
        oninput: function (e) {
          current.rate = e.target.textContent;
          dime.resources.project.persist(current);
          m.redraw();
        },
      }, current.rate),
      m("dt.enabled", "enabled"),
      m("dd.enabled", [
        m("input[type=checkbox]", {
          checked: current.enabled,
          oninput: function (e) {
            current.enabled = e.target.checked;
            dime.resources.project.persist(current);
            m.redraw();
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
    return m('dl' + disabled, rows);
  }

})(dime, m, _);
