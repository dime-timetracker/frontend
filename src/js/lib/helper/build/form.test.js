'use strict';

var expect = require('expect.js');

var buildForm = require('./form');
var Model = require('../../Model');

var collection = {
  persist: function () {
  }
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

describe('form', function() {

  it('should generate a form model', function () {
    var form = buildForm(new Model({
      name: 'Name',
      alias: 'Alias',
      rate: 30,
      enabled: true,
      properties: properties
    }), collection);
    expect(form.collection).to.be.eql(collection);
    expect(form.items).to.be.an('array');
    expect(form.items).to.have.length(5);
  });
});
