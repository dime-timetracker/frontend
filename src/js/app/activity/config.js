'use strict';

module.exports = {
  activity: {
    display: {
      defaultFilter:          { type: 'text', value: '' },
      showIncome:             { type: 'boolean', value: false },
      showActivityIncome:     { type: 'boolean', value: true },
      incomePrecisionSeconds: {
        type: 'number',
        onRead: function(value) { return value/60; },
        onWrite: function(value) { return value*60; },
        value: 15*60
      }
    },
    shortcuts: {
      selectNext:      { type: 'text', value: 'j' },
      selectPrevious:  { type: 'text', value: 'k' },
      startStop:       { type: 'text', value: 'space' },
      editTags:        { type: 'text', value: 't' },
      confirmTag:      { type: 'text', value: 'space' },
      removeLatestTag: { type: 'text', value: 'backspace' },
      confirmAllTags:  { type: 'text', value: 'enter' }
    }
  }
};
