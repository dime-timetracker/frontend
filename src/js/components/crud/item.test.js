'use strict';

var expect = require('expect.js');

var item = require('./item');
var Model = require('../../core/Model');

var collection = {
  persist: function (model) {}
};
var properties = [
  {
    key: 'name',
    title: 'name'
  },
  {
    key: 'alias',
    title: 'alias',
    type: 'text'
  },
  {
    key: 'customer',
    title: 'customer',
    type: 'relation',
    collection: {
      find: function () {
        return [];
      }
    }
  },
  {
    key: 'rate',
    title: 'rate',
    type: 'number'
  },
  {
    key: 'enabled',
    title: 'enabled',
    type: 'boolean'
  }
];

describe('Crud item', function() {
  var scope;
  it('should generate columns based on properties', function () {
    scope = item.controller(new Model({
      name: 'Name',
      alias: 'Alias',
      rate: 30,
      enabled: true,
      properties: properties
    }), collection);
    expect(scope.collection).to.be.eql(collection);
    expect(scope.columns).to.be.an('array');
    expect(scope.columns[0].type).to.be.eql('text');
    expect(scope.columns[0].value()).to.be.eql('Name');
  });
});
