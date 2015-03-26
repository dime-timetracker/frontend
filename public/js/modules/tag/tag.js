'use strict';

(function (dime, m, _) {
  
  dime.modules.tag = {
    views: {}
  };
  
  dime.modules.tag.views = {
    item: function (tag) {
      var tagname = _.isString(tag) ? tag : tag.name;
      return m("span.badge.tag", "#" + tagname);
    }
  };

})(dime, m, _);