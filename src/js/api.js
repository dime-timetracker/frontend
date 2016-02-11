'use strict';

function fetchFirstBunch (url) {

  return m
    .request({
      method: 'GET',
      url: url,
      initialValue: this,
      config: function (xhr) {
        authorize.setup(xhr);
      },
      extract: function (xhr) {
        that.pagination = extractXhrPagination(xhr);
        return xhr.responseText;
      }
    })
    .then(function success (list) {
      that.reset();

      list.forEach(function (item) {
        that.add(item);
      });

      that.order();
    }, function error(response) {
      if (_.isPlainObject(response) && response.error) {
        // TODO Notify
        if (console) {
          console.log(response);
        }
      }
    });
}

module.exports = {
  fetchFirstBunch: fetchFirstBunch,
  fetchNextBunch: fetchNextBunch,
  post: post,
  remove: remove
}
