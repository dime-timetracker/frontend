window.tranlations = window.tranlations || {};
window.translator = (function (translations, defaultLocale, _) {
  'use strict';

  var Translator = function (translations, locale) {
    if (!(this instanceof Translator)) {
        return new Translator();
    }
    this.locale = locale;
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
    _.detect(this.locale, function findTranslation(languageCode) {
      if (_.isObject(this.translation[languageCode])
              && _.isString(this.translation[languageCode][string])
              ) {
        string = this.translation[languageCode][string];
        return true;
      }
    }, this);
    return string;
  };

  return new Translator(translations, defaultLocale, _);
})(window.tranlations, navigator.language || navigator.userLanguage, _);

window.t = function (string) {
  return window.translator.translate(string);
};