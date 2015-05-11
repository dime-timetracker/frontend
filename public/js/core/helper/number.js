;(function (dime, _) {
  'use strict';

  dime.helper.number = {
    formatCurrency: function(amount, pattern) {
      if (_.isUndefined(pattern)) {
        pattern = '€ {number}';
      }
      var DecimalSeparator = Number("1.2").toLocaleString().substr(1,1);
      var AmountWithCommas = amount.toLocaleString();
      var arParts = String(AmountWithCommas).split(DecimalSeparator);
      var intPart = arParts[0];
      var decPart = (arParts.length > 1 ? arParts[1] : '');
      decPart = (decPart + '00').substr(0,2);

      var number = intPart + DecimalSeparator + decPart;
      return pattern.replace('{number}', number);
    }
  }
  
})(dime, _);
