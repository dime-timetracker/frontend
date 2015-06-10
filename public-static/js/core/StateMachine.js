;(function (dime, _) {
  'use strict';

  var buildName = function() {
    var name = [];
    for (var i = 0; i < arguments.length; i++) {
      if (_.isString(arguments[i])) {
        name.push(arguments[i]);
      }
    }
    return name.join('.');
  };

  /**
   * StateMachine define state and emit event on state change.
   *
   * Example:
   *
   * var car = new StateMachine('car', ['N', 'R', '1']);
   *
   * car.on('N', function () { neutral gear; });
   * car.on('R', function () { rear gear; });
   * car.on('1', function () { first gear; });
   *
   * car.change('N'); // --> emit event 'statemachine.car.N'
   * car.change('R'); // --> emit event 'statemachine.car.R'
   * car.change('1'); // --> emit event 'statemachine.car.1'
   * car.change('1'); // --> will not emit event again
   *
   * @param {String} name Name of state machine
   * @param {Array} states States of state machine
   * @returns {StateMachine}
   */
  var StateMachine = function (name, states) {
    if (!(this instanceof StateMachine)) {
      return new StateMachine();
    }

    this.name = 'statemachine';
    if (_.isString(name)) {
      this.name = buildName(this.name, name);
    }

    this.states = [];
    if (_.isArray(states)) {
      states.forEach(function (state) { this.add(state); }, this);
    }
  };


  StateMachine.prototype = new Object();
  StateMachine.prototype.constructor = StateMachine;

  dime.StateMachine = StateMachine;

  /**
   * Add state to statemachine
   * @param {String} state
   * @returns {StateMachine} this
   */
  StateMachine.prototype.add = function(state) {
    if (!this.has(state)) {
      this.states.push(state);
      dime.events.emit(buildName(this.name, this.current, 'add'));
    }
    return this;
  };

  /**
   * Add event listener to state.
   *
   * @param {String} state
   * @param {function} listener
   * @param {mixed} context
   * @returns {StateMachine} this
   */
  StateMachine.prototype.on = function(state, listener, context) {
    this.add(state);
    dime.events.on(buildName(this.name, state), listener, context);
    return this;
  };

  /**
   * Add event listener to state.
   *
   * @param {String} state
   * @param {function} listener
   * @param {mixed} context
   * @returns {StateMachine} this
   */
  StateMachine.prototype.once = function(state, listener, context) {
    this.add(state);
    dime.events.once(buildName(this.name, state), listener, context);
    return this;
  };

  /**
   * Check if state exists
   * @param {String} state
   * @returns {Boolean}
   */
  StateMachine.prototype.has = function(state) {
    if (!_.isString(state)) {
      throw 'state is not string';
    }

    return -1 < this.states.indexOf(state);
  };

  /**
   * Return next state.
   * @returns {String} next state
   */
  StateMachine.prototype.next = function() {
    var idx = this.states.indexOf(this.current) + 1;
    if (idx <= -1 || idx >= this.states.length) {
      idx = 0;
    }
    return this.states[idx];
  };

  /**
   * Cycle to next state
   * @returns {StateMachine} this
   */
  StateMachine.prototype.cycle = function() {
    return this.change(this.next());
  };

  /**
   * Change state and emit event to 'statemachine.NAME.STATE'
   * @param {String} state
   * @returns {StateMachine} this
   */
  StateMachine.prototype.change = function(state) {
    if (this.has(state)) {
      if (!_.isUndefined(this.current) && this.current === state) {
        return;
      }

      this.current = state;
      dime.events.emit(buildName(this.name, this.current));
    }
    return this;
  };

})(dime, _);