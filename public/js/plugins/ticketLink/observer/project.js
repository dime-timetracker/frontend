'use strict';
(function (dime, m, _) {

  dime.events.on('model-project-properties', function (context) {
    if (_.isObject(context.model)) {
      var namespace = 'ticketLink';
      var namePattern = context.model.alias + '/pattern';
      var nameUrlSchema = context.model.alias + '/urlSchema';
    }
    context.properties.push({
      key: 'ticketlink-pattern',
      title: 'Ticket Tag pattern',
      description: t('Enter a regular expression to extract ticket numbers out of tags, e.g. "[A-Z]+-[0-9]+" for JIRA tickets'),
      type: 'text',
      get: function () {
        return dime.configuration.get(namespace, namePattern);
      },
      set: function (value) {
        return dime.configuration.set(namespace, namePattern, value);
      },
    });
    context.properties.push({
      key: 'ticketlink-url',
      title: 'Ticket URL',
      type: 'url',
      get: function () {
        return dime.configuration.get(namespace, nameUrlSchema);
      },
      set: function (value) {
        return dime.configuration.set(namespace, nameUrlSchema, value);
      },
    });
  });

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
      m('.form-row.ticketlink-pattern', [
        m('label', t('Ticket Tag pattern')),
        m('input', {
          value: dime.configuration.get(namespace, namePattern),
          type: 'text',
          title: t('Enter a regular expression to extract ticket numbers out of tags, e.g. "[A-Z]+-[0-9]+" for JIRA tickets'),
          oninput: function (e) {
            dime.configuration.set(namespace, namePattern, e.target.value);
          }
        })
      ])
    );

    // Add URL schema
    context.view.children.push(
      m('.form-row.ticketlink-url', [
        m('label', t('Ticket URL')),
        m('input', {
          value: dime.configuration.get(namespace, nameUrlSchema),
          type: 'url',
          title: t('Enter a ticket URL and use [TICKET] to be replaced by the ticket number'),
          oninput: function (e) {
            dime.configuration.set(namespace, nameUrlSchema, e.target.value);
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

    var pattern   = dime.configuration.get(namespace, namePattern, '');
    var urlSchema = dime.configuration.get(namespace, nameUrlSchema, '');
    if (0 == pattern.length || 0 === urlSchema.length) {
      return;
    }
    var matches = context.tag.name.match(new RegExp(pattern));
    if (_.isNull(matches)) {
      return;
    }
    var ticketNumber = _.last(matches);
    var ticketUrl = urlSchema.replace('[TICKET]', ticketNumber);

    context.view.attrs.title = t('Open Ticket [TICKET]').replace('[TICKET]', ticketNumber);
    context.view.attrs.href = ticketUrl;
    context.view.attrs.target = '_blank';
  });

})(dime, m, _);
