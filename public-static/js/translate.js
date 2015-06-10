window.translations = window.translations || {};
window.translator = (function (translations, defaultLocale, _) {
  'use strict';

  var Translator = function (translations, locale) {
    if (!(this instanceof Translator)) {
        return new Translator();
    }
    this.locale = locale.substr(0, 2);
    this.translation = translations || {};
  };
  Translator.prototype = new Object();
  Translator.prototype.constructor = Translator;

  Translator.prototype.add = function (languageCode, translations) {
    if (true === _.isUndefined(this.translation[languageCode])) {
      this.translation[languageCode] = {};
    }
    _.forIn(translations, function (target, source) {
      this.translation[languageCode][source] = target;
    }, this);
  };

  Translator.prototype.setLocale = function (locale) {
    this.locale = locale;
  };

  Translator.prototype.translate = function (string) {
    if (_.isObject(this.translation[this.locale])
      && _.isString(this.translation[this.locale][string])
    ) {
      string = this.translation[this.locale][string];
    }
    return string;
  };

  return new Translator(translations, defaultLocale, _);
})(window.translations, navigator.language || navigator.userLanguage, _);

window.t = function (string) {
  return window.translator.translate(string);
};
