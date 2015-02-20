'use strict';
(function (document, moment, m) {
  
  var timeslice = {
    model: function (data) {
      return {
        start: m.prop(moment(data.startedAt)),
        stop: m.prop(moment(data.stoppedAt))
      };
    },
    view: function (item) {
      item.start(moment('2005-06-02 15:30:00'));
      return m("tr", [
        m("td", item.start().format("HH:mm:ss")),
        m("td", item.stop().format("HH:mm:ss"))
      ]);      
    }
  };
  
  timeslice.model.test = function () {
    console.log('test');
  };
  
  var activity = {
    model: function (data) {
      return {
        description: m.prop(data.description),
        timeslices: m.prop(data.timeslices.map(timeslice.model))
      }
    },
    controller: function () {
      this.activity = activity.model({"id":1,"userId":1,"customerId":1,"projectId":null,"serviceId":null,"description":"Wartung und Pflege","rate":null,"rateReference":null,"createdAt":"2005-06-02 15:20:00","updatedAt":"2005-06-02 15:20:00","customer":{"id":1,"userId":1,"name":"Ingenieurb\u00fcro Stra\u00dfen- und Tiefbau J\u00fcrgen Glatzer","alias":"ibg","createdAt":"2012-08-01 09:35:12","updatedAt":"2012-08-01 09:38:32"},"project":null,"service":null,"tags":[],"timeslices":[{"id":1,"activityId":1,"duration":3600,"startedAt":"2005-06-02 15:20:00","stoppedAt":"2005-06-02 16:20:00","createdAt":"-0001-11-30 00:00:00","updatedAt":"-0001-11-30 00:00:00","userId":1}, {}]});
    },
    view: function (ctrl) {
      return m("div", [
        m("p", ctrl.activity.description()),
        m("table", ctrl.activity.timeslices().map(timeslice.view))
      ]);
    }
  };
  
  
  
  
  m.module(document.getElementById("test"), activity);

})(document, moment, m);