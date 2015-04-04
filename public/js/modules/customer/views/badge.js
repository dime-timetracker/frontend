"use strict";

(function (dime, m) {

  dime.modules.customer.views.badge = function (activity) {
    var customer = activity.customer,
        cssClass = ".empty",
        title = "No customer selected",
        visibility = dime.configuration.get({name: activity.id, namespace: 'activity/customer/visibility', defaultValue: 0});

    if (customer && customer.alias && customer.alias.length) {
      cssClass = ".incomplete";
      title = "Please edit customer details";

      if (customer && customer.name && customer.name.length) {
        cssClass = "";
        title = customer.name;
      }
    }

    if (visibility && 1 === visibility) {
      cssClass += '.open';
    }

    return m("li.dropdown" + cssClass, [
      m("a.dropdown-toggle", {title: title, href: "#", onclick: function() {
            visibility = Math.abs(visibility - 1);
            dime.configuration.set({name: activity.id, namespace: 'activity/customer/visibility', value: visibility});
            return false;
          } }, "@" + (customer && customer.alias ? customer.alias : "")),
      dime.modules.customer.views.select(activity)
    ]);
  };

})(dime, m);
