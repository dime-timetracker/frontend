'use strict';

(function (dime, m) {

  dime.modules.customer.views.badge = function (activity) {
    var customer = activity.customer;
    var cssClass = '.empty';
    var title = 'No customer selected';

    if (customer) {
      cssClass = customer.name && customer.name.length ? "" : ".incomplete";
      title = customer.name && customer.name.length ? customer.name : "Please edit customer details";
    }

    return m("span.badge.customer" + cssClass, {
      title: title
    }, [
      "@" + (customer && customer.alias ? customer.alias : ""),
      dime.modules.customer.views.select(activity)
    ]);
  }

})(dime, m);
