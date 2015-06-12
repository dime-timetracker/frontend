  'use strict';

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

  if (!_.isUndefined(label)) {
    if (_.isString(label)) {
      var attr = {};
      if (input && input.attrs && input.attrs.id) {
        attr['for'] = input.attrs.id;
      }
      content.push(m('label.form-label', attr, label));
    } else {
      content.push(label);
    }
  }

  if (!_.isUndefined(input)) {
    content.push(input);
  }

  return m('.form-group', content);
};

