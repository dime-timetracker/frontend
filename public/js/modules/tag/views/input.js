'use strict';

(function (dime, m, _) {

  dime.modules.tag.views.input = function (activity) {
    var tags = activity.tags || [];
    var hasTags = 0 < tags.length;
    var tagClass = hasTags ? "" : ".empty";
    var editable = 1===dime.modules.setting.get("activity/tags/editable", activity.id, 0);

    var addTag = function (name) {
      var filter = {name: name};
      var tag = dime.resources.tag.find(filter) || filter;
      activity.tags.push(tag);
      dime.resources.activity.persist(activity);
    }

    var removeLatestTag = function () {
      activity.tags.pop();
      dime.resources.activity.persist(activity);
    }

    var removeTag = function (tag) {
      _.remove(activity.tags, function (current) {
        return current.name == tag.name;
      });
      dime.resources.activity.persist(activity);
    }

    var badge = function (tag) {
      return dime.modules.tag.views.item(
        tag,
        activity,
        null,
        editable ? removeTag : null
      );
    }
 
    var input = m("input", {
      onkeydown: function (e) {
        var backspace = 8;
        var space = 32;
        switch (e.which) {
          case space: addTag(e.target.value); break;
          case backspace: removeLatestTag(); break;
        }
      }
    });

    var setEditable = function (value) {
      dime.modules.setting.set("activity/tags/editable", activity.id, value); 
    }

    var ok = m("a[href=#].close", {
      onclick: function () { setEditable(0); return false; },
    }, "~");

    var editTagsButton = m('li', m("a[href=#].tag-edit-button", {
      title: hasTags ? "Click to edit tags" : "Click to add tags",
      onclick: function (e) { setEditable(1); }
    }, '+'));

    tagClass += editable ? '.editable' : '';
    return m("ul.nav.nav-list.badge-list.badge-list-small.pull-right.tag-badges" + tagClass,
      (hasTags ? tags.map(badge) : []).concat(editable ? [input, ok] : editTagsButton)
    );
  }

})(dime, m, _);
