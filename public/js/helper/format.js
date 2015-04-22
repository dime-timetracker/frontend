;(function (dime, _) {
  'use strict';

  dime.helper.format = {
    ucFirst: function(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
  };

})(dime, _);