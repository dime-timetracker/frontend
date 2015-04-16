'use strict';

(function (dime, _) {

  dime.translation = {};
  dime.translation.add = function (languageCode, translations) {
    if (false === _.isObject(dime.translation[languageCode])) {
      dime.translation[languageCode] = {};
    }
    _.forIn(translations, function (target, source) {
      dime.translation[languageCode][source] = target;
    });
  }

  dime.settings.general.children.translation = {
    title: "Translation",
    children: {
      preferredLanguages: {
        title: 'Preferred languages',
        description: 'Enter locale codes like "en_US" and separate them by comma. If there is no translation for the first one, the next one will be used.',
        namespace: 'general',
        name: 'translation/preferredLanguages',
        type: 'text',
        defaultValue: 'de_DE'
      }
    }
  }

  dime.translate = function (string) {
    var setting = dime.settings.general.children.translation.children.preferredLanguages;
    var preferredLanguages = dime.modules.setting.get(setting).split(',');
    _.detect(preferredLanguages, function findTranslation (languageCode) {
      if (_.isObject(dime.translation[languageCode])
        && _.isString(dime.translation[languageCode][string])
      ) {
        string = dime.translation[languageCode][string];
        return true;
      }
    });
    return string;
  };

})(dime, _)
