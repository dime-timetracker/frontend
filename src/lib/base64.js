'use strict'

module.exports = {
  decode: (string) => global.window.atob(string),
  encode: (string) => global.window.btoa(string)
}
