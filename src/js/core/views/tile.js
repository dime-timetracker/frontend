'use strict';

var m = require('mithril');
var isEmpty = require('lodash/lang/isEmpty');
var isArray = require('lodash/lang/isArray');

/**
 * Tile is a mithril virtual element to generate a tile desgin.
 *
 * ------------------------------------------------------------
 * | inner                                          | actions |
 * ------------------------------------------------------------
 * | sub1                                                     |
 * ------------------------------------------------------------
 * | sub...                                                   |
 * ------------------------------------------------------------
 *
 * Options:
 * {
 * 	active: true || false
 * 	actions: [] || m()
 * 	subs: [] || m()
 * }
 *
 * @param  {mixed} inner
 * @param  {Object} options
 * @return {VirtualElement}
 */
var tile = function(inner, options) {
  if (isEmpty(inner)) {
    throw {
      message: 'tile: Parameter inner is empty or undefined.',
      source: this
    };
  }

  options = options || {};
  var content = [];

  if (!isEmpty(options.actions)) {
    if (isArray(options.actions)) {
      content.push(
        m('.tile-action.tile-action-show',
          m('ul.nav.nav-list', options.actions.map(function(item) {
            return m('li', item);
          }))));
    } else {
      content.push(m('.tile-action.tile-action-show', m('ul.nav.nav-list', m('li', options.actions))));
    }
  }

  content.push(m('.tile-inner', inner));

  if (!isEmpty(options.subs)) {
    if (isArray(options.subs)) {
      options.subs.forEach(function(item) {
        content.push(m('.tile-sub', item));
      });
    } else {
      content.push(m('.tile-sub', options.subs));
    }
  }

  return m('.tile' + ((options.active) ? '.active' : ''), content);
};

module.exports = tile;
