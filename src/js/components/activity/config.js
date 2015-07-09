'use strict';

module.exports = {
  activity: {
    display: {
      defaultFilter:          { type: 'text', defaultValue: '' },
      showIncome:             { type: 'boolean', defaultValue: false },
      showActivityIncome:     { type: 'boolean', defaultValue: true },
      incomePrecisionSeconds: {
        type: 'number',
        onRead: function(value) { return value/60; },
        onWrite: function(value) { return value*60; },
        defaultValue: 15*60
      }
    },
    shortcuts: {
      selectNext:      { type: 'text', defaultValue: 'j' },
      selectPrevious:  { type: 'text', defaultValue: 'k' },
      startStop:       { type: 'text', defaultValue: 'space' },
      editTags:        { type: 'text', defaultValue: 't' },
      confirmTag:      { type: 'text', defaultValue: 'space' },
      removeLatestTag: { type: 'text', defaultValue: 'backspace' },
      confirmAllTags:  { type: 'text', defaultValue: 'enter' }
    }
  }
};
