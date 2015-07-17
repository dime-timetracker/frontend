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
 * @param  {mixed} inner
 * @param  {mixed} actions
 * @param  {mixed} subs
 * @param  {boolean} active
 * @return {VirtualElement}
 */
var tile = function(inner, actions, subs, active) {
  if (isEmpty(inner)) {
    throw {
      message: 'tile: Parameter inner is empty or undefined.',
      source: this
    };
  }

  var content = [];

  if (!isEmpty(actions)) {
    if (isArray(actions)) {
      content.push(
        m('.tile-action.tile-action-show',
          m('ul.nav.nav-list', actions.map(function(item) {
            return m('li', item);
          }))));
    } else {
      content.push(m('.tile-action.tile-action-show', m('ul.nav.nav-list', m('li', actions))));
    }
  }

  content.push(m('.tile-inner', inner));

  if (!isEmpty(subs)) {
    if (isArray(subs)) {
      subs.forEach(function(item) {
        content.push(m('.tile-sub', item));
      });
    } else {
      content.push(m('.tile-sub', subs));
    }
  }

  return m('.tile' + ((active) ? '.active' : ''), content);
};

module.exports = tile;
