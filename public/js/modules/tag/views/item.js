'use strict';

(function (dime, m, _) {
  
  dime.modules.tag.views.item = function (tag, activity, onclick, remove) {
    var tagname = _.isString(tag) ? tag : tag.name;

    var parts = [
      m("span.hash", "#"),
      m("span.tagname", {
        onclick: function () { _.isFunction(onclick) && onclick(tag); },
      }, tagname)
    ];


    if (_.isFunction(remove)) {
      parts.push(
        m("a[href=#].remove", {
          onclick: function () { remove(tag); return false; },
          title: "Remove tag"
        }, "×")
      );
    }

    var context = {view: m('a', {title: tag.name, target: 'self'}, parts), tag: tag, activity: activity};
    dime.events.emit('activity-item-tag-badge-view-after', context);

    return m("li.dropdown.badge.tag", context.view);
  };

})(dime, m, _);

