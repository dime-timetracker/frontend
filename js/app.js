'use strict';
(function (document, m) {

  var itemView = function (item) {
    return m("li", item.description);
  }
  
  var activities = {
    collection: [  {"id":1,"userId":1,"customerId":1,"projectId":null,"serviceId":null,"description":"Wartung und Pflege","rate":null,"rateReference":null,"createdAt":"2005-06-02 15:20:00","updatedAt":"2005-06-02 15:20:00","customer":{"id":1,"userId":1,"name":"Ingenieurb\u00fcro Stra\u00dfen- und Tiefbau J\u00fcrgen Glatzer","alias":"ibg","createdAt":"2012-08-01 09:35:12","updatedAt":"2012-08-01 09:38:32"},"project":null,"service":null,"tags":[],"timeslices":[{"id":1,"activityId":1,"duration":3600,"startedAt":"2005-06-02 15:20:00","stoppedAt":"2005-06-02 16:20:00","createdAt":"-0001-11-30 00:00:00","updatedAt":"-0001-11-30 00:00:00","userId":1}]},
 {"id":2,"userId":1,"customerId":1,"projectId":null,"serviceId":null,"description":"Wartung und Pflege","rate":null,"rateReference":null,"createdAt":"2005-06-09 15:15:00","updatedAt":"2005-06-09 15:15:00","customer":{"id":1,"userId":1,"name":"Ingenieurb\u00fcro Stra\u00dfen- und Tiefbau J\u00fcrgen Glatzer","alias":"ibg","createdAt":"2012-08-01 09:35:12","updatedAt":"2012-08-01 09:38:32"},"project":null,"service":null,"tags":[],"timeslices":[{"id":2,"activityId":2,"duration":2700,"startedAt":"2005-06-09 15:15:00","stoppedAt":"2005-06-09 16:00:00","createdAt":"-0001-11-30 00:00:00","updatedAt":"-0001-11-30 00:00:00","userId":1}]}
    ],
    controller: function () {
    },
    view: function() {
      return m("ul", this.collection.map(itemView))
    }
  };
  
  m.module(document.getElementById("test"), activities);

})(document, m);