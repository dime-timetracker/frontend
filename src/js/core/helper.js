'use strict';

var m = require('mithril');
var _ = require('lodash');
var moment = require('moment');

module.exports = {
    currency: function(amount, pattern) {
      if (_.isUndefined(pattern)) {
        pattern = '€ {number}';
      }
      var DecimalSeparator = Number("1.2").toLocaleString().substr(1,1);
      var AmountWithCommas = amount.toLocaleString();
      var arParts = String(AmountWithCommas).split(DecimalSeparator);
      var intPart = arParts[0];
      var decPart = (arParts.length > 1 ? arParts[1] : '');
      decPart = (decPart + '00').substr(0,2);

      var number = intPart + DecimalSeparator + decPart;
      return pattern.replace('{number}', number);
    },
    duration: function (data, unit) {
      if (data !== undefined && _.isNumber(data)) {
        unit = unit || 'seconds';
        var duration = moment.duration(data, unit);

        var hours = Math.floor(duration.asHours()),
            minute = duration.minutes(),
            second = duration.seconds();

        if (hours < 10) {
          hours = '0' + hours;
        }
        if (minute < 10) {
          minute = '0' + minute;
        }
        if (second < 10) {
          second = '0' + second;
        }

        return [hours, minute, second].join(':');
      }
      return '';
    },
    mousetrapCommand: function(command, t) {
      if (navigator.appVersion.indexOf("Mac") !== -1) {
        command = command.replace('mod', t('command'));
      } else {
        command = command.replace('mod', t('ctrl'));
      }
      command = command.replace('shift', t('shift'));
      command = command.replace('alt', t('alt'));
      return command;
    },
    ucFirst: function(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    },

    /**
     * concatenates arguments to base url, divided by slash
     */
    url: function () {
      var uri = [];
      var contain = false;

      for (var i = 0; i < arguments.length; i++) {
        // FIXME
//        if (dime.env.baseUrl
//                && _.isString(arguments[i])
//                && arguments[i].indexOf(dime.env.baseUrl) !== -1) {
//          contain = true;
//        }
        uri.push(arguments[i]);
      }

//      if (!contain && dime.env.baseUrl) {
//        uri.unshift(dime.env.baseUrl);
//      }

      return uri.join('/');
    }
  };
