'use strict';

var isUndefined = require('lodash/lang/isUndefined');
var isString    = require('lodash/lang/isString');
var m           = require('src/lib/mithril');

/**
 * Create a form-group.
 *
 * Call:
 *   dime.core.views.formGroup(m('input#test'), 'label');
 *
 * Output:
 *   <div class="form-group">
 *     <label class="form-label" for="test">label</label>
 *     <input type="text" id="test">
 *   </div>
 *
 * @param {m-Object} input
 * @param {mixed} label
 * @returns {m-Object}
 */
module.exports = function (input, label) {
  var content = [];

  if (!isUndefined(label)) {
    if (isString(label)) {
      var attr = {};
      if (input && input.attrs && input.attrs.id) {
        attr['for'] = input.attrs.id;
      }
      content.push(m('label.form-label', attr, label));
    } else {
      content.push(label);
    }
  }

  if (!isUndefined(input)) {
    content.push(input);
  }

  return m('.form-group', content);
};

