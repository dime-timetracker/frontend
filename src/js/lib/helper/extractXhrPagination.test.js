'use strict';

var expect = require('expect.js');

var extractXhrPagination = require('./extractXhrPagination');

describe('extractXhrPagination', function () {

  it('should extract a total of 200 and a next link', function () {
    var pagination = extractXhrPagination({
      getResponseHeader: function(header) {
        if (header === 'X-Dime-Total') {
          return '200';
        } else if (header === 'Link') {
          return '</dime/server/public/api/activity?page=2&with=100>; rel="next", </dime/server/public/api/activity?page=2&with=100>; rel="prev", </dime/server/public/api/activity?page=1&with=100>; rel="first", </dime/server/public/api/activity?page=16&with=100>; rel="last"';
        }
      }
    });
    expect(pagination).to.have.property('total');
    expect(pagination.total).to.be(200);
    expect(pagination).to.have.property('next');
    expect(pagination.next).to.be('/dime/server/public/api/activity?page=2&with=100');
  });

  it('should extract a total of 0', function () {
    var pagination = extractXhrPagination({
      getResponseHeader: function(header) {
        if (header === 'X-Dime-Total') {
          return null;
        } else if (header === 'Link') {
          return '</dime/server/public/api/activity?page=2&with=100>; rel="next", </dime/server/public/api/activity?page=2&with=100>; rel="prev", </dime/server/public/api/activity?page=1&with=100>; rel="first", </dime/server/public/api/activity?page=16&with=100>; rel="last"';
        }
      }
    });
    expect(pagination).to.have.property('total');
    expect(pagination.total).to.be(0);
  });

});
