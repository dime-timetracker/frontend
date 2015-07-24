'use strict';

var isUndefined = require('lodash/lang/isUndefined');
var forOwn = require('lodash/object/forOwn');
var t = require('../../translation');
var formItem = require('./formItem');

/**
 * Create a form view model with save and remove action.
 *
 * @param  {Model} model with properties
 * @param  {Collection} collection
 * @return {Object} form view model
 */
var buildForm = function(model, collection) {
  if (isUndefined(model.properties)) {
    throw {
      message: 'buildForm: Model has no properties',
      source: model
    };
  }

  if(isUndefined(collection)) {
    throw {
      message: 'buildForm: Collection is undefined',
      source: this
    };
  }

  var form = {
    model: model,
    collection: collection,
    changed: model.isNew(),
    items: [],
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

  // Generiere Items
  forOwn(model.properties, function (value, key) {
    this.items.push(formItem.call(this, key, value));
  }, form);

  return form;
};

module.exports = buildForm;
