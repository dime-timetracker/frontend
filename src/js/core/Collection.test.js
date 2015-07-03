'use strict';

var expect = require('expect.js');

var Collection = require('./Collection');

describe('Collection', function () {
  var collection;
  var item1 = { id: 2 };
  var item2 = { id: 1 };

  it('should build a new collection with data', function () {
    collection = new Collection({}, [item1]);

    expect(collection.length).to.be(1);
  });

  it('should add new data object', function () {
    collection.add(item2);

    expect(collection.length).to.be(2);
  });

  it('should find data object with id 1', function () {
    var item = collection.find(1);

    expect(item).to.be.an('object');
    expect(item).to.have.key('id');
  });

  it('should have a first item', function () {
    var item = collection.first();

    expect(item).to.be.an('object');
    expect(item).to.have.key('id');
    expect(item.id).to.be(2);
  });

  it('should sort and have a first item', function () {
    collection.order();

    var item = collection.first();

    expect(item).to.be.an('object');
    expect(item).to.have.key('id');
    expect(item.id).to.be(1);
  });

  it('should contain one element less when remove one', function () {
    collection.removeFromCollection(item1);
    expect(collection).to.have.length(1);
  });

  it('should be empty when reset', function () {
    collection.reset();
    expect(collection).to.have.length(0);
  });
});