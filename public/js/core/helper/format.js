;(function (dime, _) {
  'use strict';

  dime.helper.format = {
    ucFirst: function(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    },
    mousetrapCommand: function(command, t) {
      if (navigator.appVersion.indexOf("Mac")!=-1) {
        command = command.replace('mod', t('command'));
      } else {
        command = command.replace('mod', t('ctrl'));
      }
      command = command.replace('shift', t('shift'));
      command = command.replace('alt', t('alt'));
      return command;
    }
  };

})(dime, _);
