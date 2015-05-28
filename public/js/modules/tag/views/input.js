'use strict';

(function (dime, m, _) {

  dime.modules.tag.views.input = function (activity) {
    var tags = activity.tags || [];
    var hasTags = 0 < tags.length;
    var tagClass = hasTags ? '' : '.empty';
    var editable = 1===dime.configuration.get('activity/tags/editable', activity.id, 0);

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

    var onFocusInput = function (focus) {
      Mousetrap(focus.target).bind(dime.configuration.get(
        dime.configuration.activity.children.shortcuts.children.confirmTag
      ), function(e) {
        addTag(e.target.value);
        return false;
      });

      Mousetrap(focus.target).bind(dime.configuration.get(
        dime.configuration.activity.children.shortcuts.children.removeLatestTag
      ), function(e) {
        if (!e.target.value) {
          removeLatestTag();
          return false;
        }
      });

      Mousetrap(focus.target).bind(dime.configuration.get(
        dime.configuration.activity.children.shortcuts.children.confirmAllTags
      ), function(e) {
        if (e.target.value) {
          addTag(e.target.value);
        }
        setEditable(0);
        Mousetrap(e.target).reset();
        return false;
      });
    }


    var autofocus = function (el, init){
      if( !init ) el.focus();
    }

    var inputProperties = {
      config: autofocus,
      onfocus: onFocusInput,
      onblur: function (e) { Mousetrap(e.target).reset(); }
    }

    var setEditable = function (value) {
      dime.configuration.set('activity/tags/editable', activity.id, value);
    }

    var ok = m('a[href=#].close', {
      onclick: function () { setEditable(0); return false; },
    }, '[' + dime.configuration.get(
      dime.configuration.activity.children.shortcuts.children.confirmAllTags
    ) + ']');

    var input = m('li.badge.tag.input', ['#', m('input.mousetrap', inputProperties), ok]);

    var editTagsButton = m('li', m('a[href=#].tag-edit-button', {
      title: hasTags ? 'Click to edit tags' : 'Click to add tags',
      onclick: function (e) { setEditable(1); }
    }, '+'));

    tagClass += editable ? '.editable' : '';
    return m('ul.nav.nav-list.badge-list.badge-list-small.pull-right.tag-badges' + tagClass,
      (hasTags ? tags.map(badge) : []).concat(editable ? input : editTagsButton)
    );
  }

})(dime, m, _);
