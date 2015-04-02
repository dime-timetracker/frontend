'use strict';

(function (dime, m) {

  dime.modules.customer.views.badge = function (activity) {
    var customer = activity.customer;
    var cssClass = '.empty';
    var title = 'No customer selected';

    if (customer && customer.alias && customer.alias.length) {
      cssClass = '.incomplete';
      title = 'Please edit customer details';

      if (customer && customer.name && customer.name.length) {
        cssClass = '';
        title = customer.name;
      }

    }

    return m("span.badge.customer" + cssClass, {
      title: title
    }, [
      "@" + (customer && customer.alias ? customer.alias : ""),
      dime.modules.customer.views.select(activity)
    ]);
  }

})(dime, m);
