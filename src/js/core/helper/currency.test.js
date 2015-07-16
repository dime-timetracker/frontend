'use strict';

require('intl');
var expect = require('expect.js');

var currency = require('./currency');

describe('currency', function () {

  global.window.navigator = {
    language: 'de-DE'
  };

  var nbsp = '\u00A0';

  it('should convert number (3.22) into formated string € 3,22', function () {
    var result = currency(3.22, {}, 'de-DE');
    expect(result).to.be('3,22' + nbsp + '€');

    var result = currency(3.22, undefined, 'de-DE');
    expect(result).to.be('3,22' + nbsp + '€');
  });

  it('should convert number (3.22) into formated string $ 3,22 in US locale', function () {
    var result = currency(3.22, {currency: 'USD'}, 'en-US');
    expect(result).to.be('$3.22');
  });

  it('should convert number (3.22) into formated string 3,22 $ in German locale', function () {
    var result = currency(3.22, {currency: 'USD'}, 'de-DE');
    expect(result).to.be('3,22' + nbsp + '$');
  });

});
