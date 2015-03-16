'use strict';

(function (dime, moment) {
  dime.helper.duration = {
    format: function(data, unit) {
      if (data !== undefined && _.isNumber(data)) {
        unit = unit || 'seconds';
        var duration = moment.duration(data, unit);

        var hours = Math.floor(duration.asHours()),
          minute = duration.minutes(),
          second = duration.seconds();

        if (hours<10) {
          hours = '0' + hours;
        }
        if (minute<10) {
          minute = '0' + minute;
        }
        if (second<10) {
          second = '0' + second;
        }

        return [hours, minute, second].join(':');
      }
      return '';
    }
  }
})(dime, moment);
