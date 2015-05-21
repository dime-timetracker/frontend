;(function (dime, m) {
  'use strict';

  dime.core.views.card = function(content, title) {
    content = content || [];

    var inner = [];
    if (!_.isUndefined(title)) {
      inner.push(m('.card-header', m('.card-inner', m('h1.card-heading', title))));
    }

    inner.push(m('.card-inner', content));


    return m('.card', m('.card-main', inner));
  };

})(dime, m)
