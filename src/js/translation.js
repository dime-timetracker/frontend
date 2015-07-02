'use strict';

var translator = require('translate.js');

var translations = {
  de: require('./translations/de').translation,
  en: require('./translations/en').translation
};

module.exports = function() {
  var language = (global.window.navigator.language || global.window.navigator.userLanguage).substr(0, 2);
  var t = translator(translations[language] || translations['en']);
  return t.apply(undefined, arguments);
};
