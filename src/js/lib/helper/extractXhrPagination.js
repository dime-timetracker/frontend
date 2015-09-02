'use strict';

function extractXhrPagination (xhr) {
  var pagination = {};

  // extract total number
  pagination.total = parseInt(xhr.getResponseHeader('X-Dime-Total') || 0);

  // extract pagination links
  if (xhr.getResponseHeader('Link')) {
    var uri = xhr.getResponseHeader('Link').split(', ');
    uri.forEach(function (link) {
      var m = link.match(/<(.*)>; rel="(.*)"/);
      pagination[m[2]] = m[1];
    });
  }
  return pagination;
}

module.exports = extractXhrPagination;
