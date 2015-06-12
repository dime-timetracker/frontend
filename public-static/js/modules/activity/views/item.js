;(function (dime, m, moment, _) {
  'use strict';
  
  dime.timer = setInterval(m.redraw, 1000);

  var startStopButton = function(current) {
    var icon = ".icon.icon-play-arrow", color = "";
    if (current.running()) {
      icon = ".icon.icon-stop";
      color = ".orange-text";
    }

    return  m("a" + color, {
      href: '#',
      title: t(current.running() ? 'stop activity' : 'start activity'),
      onclick: function() { current.startStopTimeslice(); return false; }
    }, [
      m("span" + icon),
      " ",
      dime.helper.format.duration(current.totalDuration(), 'seconds')
    ]);
  };

  dime.modules.activity.views.item = function (current, idx) {
    var badges = [
      dime.core.views.badge('customer', current),
      dime.core.views.badge('project', current),
      dime.core.views.badge('service', current)
    ];

    var badgesView = m('ul.nav.nav-list.badge-list.badge-list-small', badges);
    dime.events.emit('activity-item-badges-view-after', {view: badgesView, item: current});

    var actionsView = m('ul.nav.nav-list.pull-right', [
      m('li.toggle-timeslices', m('a', {
        href: '#',
        title: t('Show timeslices'),
        onclick: function() { current.toggleTimeslices(); return false; }
      }, m('span.icon.icon-access-time'))),
      m('li.start-stop-button', startStopButton(current)),
      m('li.remove', m('a', {
        href: '#',
        title: t('Delete'),
        onclick: function() {
          var question = t('Do you really want to delete "[activity]"?').replace('[activity]', current.description);
          if (confirm(question)) dime.resources.activity.remove(current);
          return false;
        }
      }, m('span.icon.icon-delete')))
    ]);
    dime.events.emit('activity-item-actions-view-after', {view: actionsView, item: current});

    var descriptionsView = m('span.text-overflow pull-left', {
      contenteditable: true,
      oninput: function(e) {
        current.updateDescription(e.target.textContent);
        return false;
      }
    }, current.description);
    dime.events.emit('activity-item-actions-view-after', {view: descriptionsView, item: current});

    var tagBadgesView = dime.modules.activity.views.tagInput(current);

    var tileClasses = ['tile'];
    var htmlId = '';
    if (t('(Click here to enter a description!)') === current.description) {
      tileClasses.push('text-red');
    }

    if (dime.modules.activity.selectedIdx === idx) {
      tileClasses.push('green', 'lighten-4');
      htmlId = '#currentActivity';
    }

    var content = [
      m('.pull-left.tile-side', badgesView),
      m('.tile-action.tile-action-show', actionsView),
      m('.tile-inner', [descriptionsView, tagBadgesView])
    ];
    
    if (current.showTimeslices) {
      var timeslicesView = dime.modules.activity.views.timeslices(current);
      dime.events.emit('activity-item-timeslices-view-after', {view: timeslicesView, item: current});
      content.push(m('.tile-sub', timeslicesView));
    }

    var result = m(htmlId + '.' + tileClasses.join('.'), content);
    dime.events.emit('activity-item-view-after', {view: result, item: current});
    return result;
  };

})(dime, m, moment, _);