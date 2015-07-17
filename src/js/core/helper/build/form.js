'use strict';

var _ = require('lodash');
var t = require('../../../translation');
var formItem = require('./formItem');

/**
 * Create a form view model with save and remove action.
 *
 * @param  {Model} model with properties
 * @param  {Collection} collection
 * @return {Object} form view model
 */
var buildForm = function(model, collection) {
  if (_.isUndefined(model.properties)) {
    throw {
      message: 'buildForm: Model has no properties',
      source: model
    };
  }

  if(_.isUndefined(collection)) {
    throw {
      message: 'buildForm: Collection is undefined',
      source: this
    };
  }

  var form = {
    model: model,
    collection: collection,
    changed: model.isNew(),
    save: function (e) {
      if (e) {
        e.preventDefault();
      }
      form.changed = false;
      collection.persist(model);
    },
    remove: function (e) {
      if (e) {
        e.preventDefault();
      }

      var question = t('Do you really want to delete "[name]"?').replace('[name]', model.name);
      if (global.window.confirm(question)) {
        collection.remove(model);
        form.changed = false;
      }
    }
  };

  form.items = model.properties.map(formItem, form);

  return form;
};

module.exports = buildForm;
