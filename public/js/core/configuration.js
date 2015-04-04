/*
 * TODO Link with Settings
 */

dime.configuration = (function (undefined) {
  var configuration = {};

  return {
    get: function(opt) {
      var value = undefined,
          c = configuration;
      if (_.isString(opt)) {
        value = configuration[opt];
      } else {
        if (opt.defaultValue !== undefined) {
          value = opt.defaultValue;
        }

        if (opt.namespace !== undefined) {
          c = configuration[opt.namespace];
        }

        if (c && opt.name !== undefined && c[opt.name]) {
          value = c[opt.name];
        }
      }

      return value;
    },
    set: function(opt) {
      var value = opt.value;

      if (opt.namespace !== undefined) {
        if (configuration[opt.namespace] === undefined) {
          configuration[opt.namespace] = {};
        }
        if (opt.name !== undefined) {
          configuration[opt.namespace][opt.name] = value;
        }
      } else if (opt.name !== undefined) {
        configuration[opt.name] = value;
      }

      return this;
    }
  };
})(undefined);