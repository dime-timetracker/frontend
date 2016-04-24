'use strict';

var expect = require('expect.js');

var formBuilder = require('./formBuilder');

describe('formBuilder controller', function () {
  var model = {
    name: 'Name',
    alias: 'Alias',
    rate: 30,
    enabled: true,
    customer: {
      name: 'b1',
      alias: 'b1'
    },
    properties: {
      name: {},
      enabled: {
        type: 'boolean'
      }
    }
  };

  it('should generate a form model', function () {
    var scope = formBuilder.controller({
      model: model,
      onSubmit: function () {
        return 'submit';
      }
    });

    expect(scope).to.be.an('object');
    expect(scope).to.have.property('model');
    expect(scope).to.have.property('onSubmit');
    expect(scope.onSubmit()).to.be('submit');
    expect(scope.properties).to.be.an('array');
    expect(scope.properties.length).to.be(2);
  });
});
