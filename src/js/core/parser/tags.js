'use strict';

module.exports = function (obj) {
  var tags = obj._text.match(/\B#([a-z0-9\-\/\_+]+)\b/gi);
  if (null !== tags) {
    var tagNames = [];
    tags.forEach(function (tag) {
      tagNames.push({ name: tag.substr(1) });
      obj._text = obj._text.replace(tag, '', 'g');
    });
    obj.tags = tagNames;
  }
  return obj;
};
