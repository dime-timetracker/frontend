'use strict';

module.exports = function (obj, key, prefix) {
  var matches = obj._text.match(new RegExp('\\B' + prefix + '([a-z0-9\\-\\/\\_+]+)\\b', 'i'));
  if (null !== matches) {
    obj[key] = {
      alias: matches[1]
    };
    obj._text = obj._text.replace(prefix + matches[1], '', 'g');
  }
  return obj;
};
