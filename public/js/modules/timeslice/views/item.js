'use strict';
(function (dime, m, moment, _) {

  dime.modules.timeslice.views.item = function (timeslice, idx, columns) {

    var checkbox = m('input[type=checkbox]', {
      onchange: function (e) {console.log('click');}
    });

    var result = [
      m('span.col-md-1', checkbox)
    ];

    _.forOwn(columns, function(column, idx) {
      result.push(
        m('span.col-md-' + column.width + '.' + idx, column.getter(timeslice))
      )
    });

    return m('.tile', m('.tile-inner.row', result));
  };

})(dime, m, moment, _);

