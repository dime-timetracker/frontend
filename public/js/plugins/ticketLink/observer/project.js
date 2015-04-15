'use strict';
(function (dime, m, _) {

  dime.settings.ticketLink = {
    title: "Ticket Link Settings",
    children: {}
  };

  dime.events.on('project-form-rows-view-after', function(context) {
    if (false === _.isString(context.project.alias)) {
      return;
    }
    var projectAlias = context.project.alias;
    var namespace = 'ticketLink';
    var namePattern = projectAlias + '/pattern';
    var nameUrlSchema = projectAlias + '/urlSchema';

    // Add pattern
    context.view.children.push(
      m(".form-row.ticketlink-pattern", [
        m("label", "Ticket Tag pattern"),
        m("input", {
          value: dime.modules.setting.get(namespace, namePattern),
          type: 'text',
          title: "Enter a regular expression to extract ticket numbers out of tags, e.g. '[A-Z]+-[0-9]+' for JIRA tickets",
          oninput: function (e) {
            dime.modules.setting.set(namespace, namePattern, e.target.value);
          }
        })
      ])
    );

    // Add URL schema
    context.view.children.push(
      m(".form-row.ticketlink-url", [
        m("label", "Ticket URL"),
        m("input", {
          value: dime.modules.setting.get(namespace, nameUrlSchema),
          type: 'url',
          title: "Enter a ticket URL and use [TICKET] to be replaced by the ticket number",
          oninput: function (e) {
            dime.modules.setting.set(namespace, nameUrlSchema, e.target.value);
          }
        })
      ])
    );
  });

  dime.events.on('activity-item-tag-badge-view-after', function(context) {
    if (false === _.isString(context.activity.project.alias)) {
      return;
    }
    var projectAlias = context.activity.project.alias;
    var namespace = 'ticketLink';
    var namePattern = projectAlias + '/pattern';
    var nameUrlSchema = projectAlias + '/urlSchema';

    var pattern   = dime.modules.setting.get(namespace, namePattern, '');
    var urlSchema = dime.modules.setting.get(namespace, nameUrlSchema, '');
    if (0 == pattern.length || 0 === urlSchema.length) {
      return;
    }
    var matches = context.tag.name.match(new RegExp(pattern));
    if (_.isNull(matches)) {
      return;
    }
    var ticketNumber = _.last(matches);
    var ticketUrl = urlSchema.replace('[TICKET]', ticketNumber);

    context.view.attrs.title = 'Open Ticket ' + ticketNumber;
    context.view.attrs.href = ticketUrl;
    context.view.attrs.target = '_blank';
  });

})(dime, m, _);
