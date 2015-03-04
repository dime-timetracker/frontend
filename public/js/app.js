'use strict';

(function (dime, document, m) {
  dime.store = new Amygdala({
    config: {
      apiUrl: dime.apiUrl,
      idAttribute: 'id',
      localStorage: false
    },
    schema: dime.schema
  });

  //setup routes to start with or without the `#` symbol
  m.route.mode = "pathname";
  m.route.mode = "hash";

  m.route(document.getElementById("main"), "/", dime.routes);
  m.module(document.getElementById("menu"), dime.modules.menu)

})(dime, document, m)
