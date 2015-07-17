'use strict';

var expect = require('expect.js');

var buildFormItem = require('./formItem');
var Collection = require('../../../core/Collection');

describe('formItem', function () {
  var form = {
    model: {
      name: 'Name',
      alias: 'Alias',
      rate: 30,
      enabled: true,
      customer: {
        name: 'b1',
        alias: 'b1'
      }
    },
    collection: [],
  };

  it('should generate a form item model of type text', function() {
    var item = buildFormItem.call(form, {
      key: 'name',
      title: 'name'
    });

    expect(item).to.be.an('object');
    expect(item).to.not.be.empty();
    expect(item).to.have.property('type');
    expect(item).to.have.property('key');
    expect(item).to.have.property('value');
    expect(item.key).to.be('name');
    expect(item.type).to.be('text');
    expect(item.value()).to.be('Name');

    item.action('xxx');
    expect(item.value()).to.be('xxx');
  });

  it('should generate a form item model of type boolean', function() {
    var item = buildFormItem.call(form, {
      key: 'enabled',
      title: 'name',
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

    item.action(false);
    expect(item.value()).to.be(false);
  });

  it('should generate a form item model of type relation', function() {
    var customer1 = {name: 'c1', alias: 'a1'};
    var item = buildFormItem.call(form, {
      key: 'customer',
      title: 'customer',
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
    expect(item.value()).to.be(form.model.customer);

    item.action('a1');
    expect(item.value()).to.be(customer1);
  });

});
