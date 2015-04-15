'use strict';

(function (dime, m, _) {

  dime.modules.tag.views.badges = function (activity) {
    var tags = activity.tags || [];
    var hasTags = 0 < tags.length;
    var tagClass = hasTags ? "" : ".incomplete";

    var removeTag = function (tag) {
      _.remove(activity.tags, function (current) {
        return current.name == tag.name;
      });
      dime.resources.activity.persist(activity);
    }

    var badge = function (tag) {
      var result = dime.modules.tag.views.item(
        tag,
        function () { setEditable(1); return false; },
        removeTag
      );
      var context = {view: result, tag: tag, activity: activity};
      dime.events.emit('activity-item-tag-badge-view-after', context);
      return context.view;
    }
 
    return m("li.tag-badges" + tagClass, tags.map(badge));
  }

})(dime, m, _);
