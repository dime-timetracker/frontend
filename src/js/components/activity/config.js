'use strict';

module.exports = {
    title: 'Activity',
    description: 'Activity settings',
    children: {
      display: {
        title: 'Display settings',
        children: {
          defaultFilter: {
            title: 'Default filter',
            name: 'activity/display/defaultFilter',
            type: 'text',
            defaultValue: ''
          },
          showIncome: {
            title: "Show Income",
            name: "activity/display/showIncome",
            type: "boolean",
            defaultValue: false
          },
          showActivityIncome: {
            title: "Show income for activities",
            name: "activity/display/showActivityIncome",
            defaultValue: true,
            type: "boolean"
          },
          incomePrecisionSeconds: {
            title: "Income Precision (in minutes)",
            description: "Round each timeslice duration according to this precision",
            name: "activity/display/incomePrecisionSeconds",
            type: "number",
            onRead: function(value) { return value/60; },
            onWrite: function(value) { return value*60; },
            defaultValue: 15*60
          }
        }
      },
      shortcuts: {
        title: 'Shortcuts',
        children: {
          selectNext: {
            title: 'Select next activity',
            name: 'activity/shortcuts/selectNext',
            type: 'text',
            defaultValue: 'j'
          },
          selectPrevious: {
            title: 'Select previous activity',
            name: 'activity/shortcuts/selectPrevious',
            type: 'text',
            defaultValue: 'k'
          },
          startStop: {
            title: 'Start/stop activity',
            name: 'activity/shortcuts/startStop',
            type: 'text',
            defaultValue: 'space'
          },
          editTags: {
            title: 'Edit tags of current activity',
            name: 'activity/shortcuts/editTags',
            type: 'text',
            defaultValue: 't'
          },
          confirmTag: {
            title: 'Confirm tag',
            name: 'activity/shortcuts/confirmTag',
            type: 'text',
            defaultValue: 'space'
          },
          removeLatestTag: {
            title: 'Remove latest tag',
            name: 'activity/shortcuts/removeLatestTag',
            type: 'text',
            defaultValue: 'backspace'
          },
          confirmAllTags: {
            title: 'Confirm all tags',
            namespace: 'activity',
            name: 'activity/shortcuts/confirmAllTags',
            type: 'text',
            defaultValue: 'enter'
          }
        }
      }
    }
  };