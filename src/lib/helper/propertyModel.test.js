'use strict';

var expect = require('expect.js');

var propertyModel = require('./propertyModel');
var Collection = require('../Collection');

describe('propertyModel', function () {
  var model = {
    name: 'Name',
    alias: 'Alias',
    rate: 30,
    enabled: true,
    customer: {
      name: 'b1',
      alias: 'b1'
    }
  };

  it('should generate a property model of type text', function() {
    var item = propertyModel.call(model, 'name');

    expect(item).to.be.an('object');
    expect(item).to.not.be.empty();
    expect(item).to.have.property('type');
    expect(item).to.have.property('key');
    expect(item).to.have.property('value');
    expect(item.key).to.be('name');
    expect(item.type).to.be('text');
    expect(item.value()).to.be('Name');

    item.update('xxx');
    expect(item.value()).to.be('xxx');
  });

  it('should generate a property model of type boolean', function() {
    var item = propertyModel.call(model, 'enabled', {
      type: 'boolean'
    });

    expect(item).to.be.an('object');
    expect(item).to.not.be.empty();
    expect(item).to.have.property('type');
    expect(item).to.have.property('key');
    expect(item).to.have.property('value');
    expect(item.key).to.be('enabled');
    expect(item.type).to.be('boolean');
    expect(item.value()).to.be(true);

    item.update(false);
    expect(item.value()).to.be(false);
  });

  it('should generate a property model of type relation', function() {
    var customer1 = {name: 'c1', alias: 'a1'};
    var item = propertyModel.call(model, 'customer', {
      type: 'relation',
      collection: new Collection({}, [customer1, {name: 'b1', alias: 'b1'}])
    });

    expect(item).to.be.an('object');
    expect(item).to.not.be.empty();
    expect(item).to.have.property('type');
    expect(item).to.have.property('key');
    expect(item).to.have.property('value');
    expect(item.key).to.be('customer');
    expect(item.type).to.be('relation');
    expect(item.value()).to.be(model.customer);
  });

});
