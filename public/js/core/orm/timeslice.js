;(function (dime, Model, moment) {

  dime.model.Timeslice = function(data) {
    if (!(this instanceof dime.model.Timeslice)) {
        return new dime.model.Timeslice(data);
    }
    _.extend(this, {
      startedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      duration: 0
    }, data);
  };

  dime.model.Timeslice.prototype = new Model();
  dime.model.Timeslice.prototype.constructor = dime.model.Timeslice;

  dime.model.Timeslice.prototype.calcDuration = function() {
    var result = 0;
    if (_.isNull(this.duration) || this.duration === 0) {
        result = moment().diff(moment(this.startedAt), "seconds");
    } else {
      result = parseInt(this.duration);
    }

    return result;
  };

})(dime, Model, moment);