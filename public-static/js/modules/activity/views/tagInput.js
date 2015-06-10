;(function (dime, m, _) {
  'use strict';

  dime.modules.activity.views.tagInput = function (activity) {
    var tags = activity.tags || [];
    var hasTags = 0 < tags.length;
    var tagClass = hasTags ? '' : '.empty';
    var editable = 1===dime.configuration.getLocal('activity/' + activity.id + '/tags/editable', 0);

    var addTag = function (name) {
      var filter = {name: name};
      var tag = dime.resources.tag.find(filter) || filter;
      activity.tags.push(tag);
      dime.resources.activity.persist(activity);
    };

    var removeLatestTag = function () {
      activity.tags.pop();
      dime.resources.activity.persist(activity);
    };

    var removeTag = function (tag) {
      _.remove(activity.tags, function (current) {
        return current.name == tag.name;
      });
      dime.resources.activity.persist(activity);
    };

    var badge = function (tag) {
      return dime.modules.activity.views.tagItem(
        tag,
        activity,
        null,
        editable ? removeTag : null
      );
    };

    var config = dime.configuration;
    var shortcuts = {
      confirmTag: config.get(config.activity.children.shortcuts.children.confirmTag),
      removeLatest: config.get(config.activity.children.shortcuts.children.removeLatestTag),
      confirmAllTags: config.get(config.activity.children.shortcuts.children.confirmAllTags)
    };

    var onFocusInput = function (focus) {
      Mousetrap.pause();

      Mousetrap(focus.target).bind(shortcuts.confirmTag, function(e) {
        addTag(e.target.value);
        return false;
      });
      Mousetrap.unpauseCombo(shortcuts.confirmTag);

      Mousetrap(focus.target).bind(shortcuts.removeLatest, function(e) {
        if (!e.target.value) {
          removeLatestTag();
          return false;
        }
      });
      Mousetrap.unpauseCombo(shortcuts.removeLatest);

      Mousetrap(focus.target).bind(shortcuts.confirmAllTags, function(e) {
        if (e.target.value) {
          addTag(e.target.value);
        }
        setEditable(0);
        e.target.blur();
        return false;
      });
      Mousetrap.unpauseCombo(shortcuts.confirmAllTags);
    };


    var autofocus = function (el, init){
      if( !init ) el.focus();
    };

    var inputProperties = {
      config: autofocus,
      onfocus: onFocusInput,
      onblur: function (e) {
        Mousetrap(e.target).reset();
        Mousetrap.unpause();
      }
    };

    var setEditable = function (value) {
      dime.configuration.setLocal('activity/' + activity.id + '/tags/editable', value);
    };

    var ok = m('a[href=#].close', {
      onclick: function () { setEditable(0); return false; },
    }, '[' + dime.configuration.get(
      dime.configuration.activity.children.shortcuts.children.confirmAllTags
    ) + ']');

    var input = m('li.badge.tag.input', ['#', m('input.tag', inputProperties), ok]);

    var editTagsButton = m('li.badge.tag', m('a[href=#].tag-edit-button', {
      title: hasTags ? 'Click to edit tags' : 'Click to add tags',
      onclick: function (e) { setEditable(1); return false; }
    }, '+'));

    tagClass += editable ? '.editable' : '';
    return m('ul.nav.nav-list.badge-list.badge-list-small.pull-right.tag-badges' + tagClass,
      (hasTags ? tags.map(badge) : []).concat(editable ? input : editTagsButton)
    );
  };

})(dime, m, _);
