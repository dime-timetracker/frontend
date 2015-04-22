'use strict';

(function (dime, m, moment, _) {

  var t = dime.translate;

  dime.modules.activity.views.filter = function filterView (scope) {

    if (!scope.filter) {
      scope.filter = {
        help: false,
        suggestions: []
      }
    }

    var showFilterHelp = '.hide';
    if (scope.filter.help) {
      showFilterHelp = '';
    }

    var updateFilter = function updateFilter(e) {
        dime.modules.activity.filters = {
          'default': function (activity) { return true; }
        };
        var filter = dime.parser.parse(e.target.value);
        _.forIn(filter, function(value, key) {
          if (_.isObject(value) && _.isString(value.alias)) {
            dime.modules.activity.filters[key] = function(activity) {
              return activity[key].alias === value.alias;
            };
          }
        });
        if (filter.description.length) {
          dime.modules.activity.filters.description = function(activity) {
            return _.contains(activity.description, filter.description);
          }
        }

        dime.helper.prompt.blur(e, scope.filter);
    }

    Mousetrap.bind(dime.helper.prompt.shortcuts().focusFilter, function(e) {
      document.getElementById('filter').focus();
      return false;
    });

    var filterInput = m('.tile', [
      m('.tile-side.pull-left', m('span.icon.icon-filter-list')),
      m('.tile-inner', 
        m('input#filter.form-control.mousetrap', {
          placeholder: t('Filter activities'),
          onfocus: function (e) { dime.helper.prompt.init(e, scope.filter, updateFilter) },
          onblur: function (e) { dime.helper.prompt.blur(e, scope.filter) },
          onkeydown: function (e) { dime.helper.prompt.updateSuggestions(e, scope.filter) }
        })
      )
    ]);

    var filterSuggestions = m('.tile', [
      m('div.row.suggestions', [
        scope.filter.suggestions.map(function (suggestion) {
          return m('div.col-lg-2.col-md-3.col-sm-4',
            m('div.card.suggestion.' + (suggestion.selected ? '.card-blue-bg' : ''),
              m('div.card-main',
                m('div.card-inner', [
                  m('p.card-heading.alias', suggestion.alias),
                  m('p.name', suggestion.name || t('(Please edit details!)')),
                ])
              )
            )
          );
        })
      ])
    ]);

    var filterHelp = m('.tile', [
      m('div.form-help.form-help-msg' + showFilterHelp, [
        m('.text-red', 'STYLE ME :)'),
        m('span.basics', [
          t('You may filter your activities by description.'),
          t('Use "-" before some search term to exclude matching activities.')
        ]),
        m('ul', [
          m('li.customer', t('Use "@" to specify a customer.')),
          m('li.project', t('Use "/" to specify a project.')),
          m('li.service', t('Use ":" to specify a service.')),
          m('li.tags', t('Use "#" to add tags.')),
        ])
      ])
    ]);

    return m('.tile-wrap.filter', m('.tile', [
      filterInput,
      filterSuggestions,
      filterHelp
    ]));
  };

  dime.settings.prompt.children.shortcuts.children.focusFilter = {
    title: 'Focus filter',
    description: 'Press this key to focus filter',
    namespace: "prompt",
    name: "shortcuts/focusFilter",
    type: "text",
    defaultValue: 'mod+f'
  };

})(dime, m, moment, _);
