'use strict';

var t = require('../../translation');
var formViews = {
  group: require('./form/group'),
  input: require('./form/input'),
  select: require('./form/select'),
  selectBoolean: require('./form/selectBoolean')
};

/**
 * Mithril view for a form item model.
 * @param  {Object} model form item model
 * @return {VirtualElement}
 */
var formView = function(model) {
  var input;

  switch (model.type) {
    case 'boolean':
      input = formViews.selectBoolean(model.value(), model.action);
      break;
    case 'select':
      input = formViews.select(model.values(), model.action, model.value());
      break;
    case 'relation':
      input = formViews.select(
        model.values(),
        model.action,
        (model.value()) ? model.value().alias: ''
      );
      break;
    default:
      input = formViews.input(model.value(), model.action, model.type);
  }

  return formViews.group(input, t(model.key));
};

module.exports = formView;
