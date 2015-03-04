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

  //setup routes to start w/o the `#` symbol
  m.route.mode = "pathname";

  m.route(document.getElementById("main"), "/", dime.routes);

})(dime, document, m)
