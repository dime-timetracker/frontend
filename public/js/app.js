;(function (dime, document, m) {
  'use strict';

  //setup routes to start with or without the `#` symbol
  m.route.mode = "pathname";
  m.route.mode = "hash";


  m.route(document.getElementById("app"), "/", dime.routes);
  m.module(document.getElementById("app-header"), dime.modules.header);
  m.module(document.getElementById("app-menu"), dime.modules.menu);
  m.module(document.getElementById("prompt-container"), dime.modules.prompt);

})(dime, document, m)
