'use strict';

(function (dime) {
  dime.helper.utils = {
    toggleClassName: function(el, className) {
      var classes = el.className.split(" ");
      var classNameIndex = classes.indexOf(className);
      if (-1 == classNameIndex) {
        classes.push(className);
      } else {
        classes.splice(classNameIndex, 1);
      }
      el.className = classes.join(" ");
    }
  }
})(dime);
