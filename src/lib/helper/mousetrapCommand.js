'use strict';

var t = require('../translation');

/**
 * Replace 'mod' with translated 'command' (Mac) or 'ctrl'
 *
 * Example:
 *
 * mousetrapCommand('mod+1') => 'ctrl+1'
 *
 * @param  {String} command
 * @return {String}
 */
var mousetrapCommand = function (command) {
  if (global.navigator.appVersion.indexOf("Mac") !== -1) {
    command = command.replace('mod', t('command'));
  } else {
    command = command.replace('mod', t('ctrl'));
  }
  command = command.replace('shift', t('shift'));
  command = command.replace('alt', t('alt'));
  return command;
};

module.exports = mousetrapCommand;
