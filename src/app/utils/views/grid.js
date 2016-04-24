'use strict';

var m = require('mithril');
var gridCount = 12;

/**
 * Define a grid based on the function arguments.
 *
 * Call:
 *   grid(m('div', 'content1'), m('div', 'content2'))
 *
 * Result:
 *   <div class="row">
 *     <div class="col-lg-6">content1</div>
 *     <div class="col-lg-6">content2</div>
 *   </div>
 *
 * @param *
 * @returns view
 */
module.exports = function() {
  var content = [];
  if (arguments.length > 0) {
    var number = Math.floor(gridCount / arguments.length);
    for (var i = 0; i < arguments.length; i++) {
      content.push(m(['.col-lg-' + number, '.col-md-' + number].join(''), arguments[i]));
    }
  }

  return m('.row', content);
};

