'use strict';

(function (dime, m, _) {

  dime.modules.tag.views.input = function (activity) {
    var tags = activity.tags || [];
    var hasTags = 0 < tags.length;
    var tagClass = hasTags ? "" : ".empty";

    return m("span.tag-badges" + tagClass, {
      title: hasTags ? "Click to edit tags" : "Click to add tags"
    }, hasTags
      ? tags.map(dime.modules.tag.views.item)
      : m("span.badge.tag.incomplete", "#")
    );
  }

})(dime, m, _);
