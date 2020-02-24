require("./polyfill/promise");
var StringKeyMap = require("./collection").StringKeyMap;
var EventNotifier = require("./event-notifier").EventNotifier;

module.exports = (function ()
{
    /**
     *  @constructor
     *  @param {Record<string, any>} [option]
     */
    function TimerScheduler()
    {
        var option = arguments[0] || {};

        /** @type {PromiseConstructor} */this._Promise = option.Promise || Promise;

        /** @type {Map<string, Timer>} */this._timerMap = new StringKeyMap();
    }

    TimerScheduler.prototype = {
        constructor : TimerScheduler,

        schedule : function start(name, interval)
        {
            var context = arguments[2];

            if(this._timerMap.has(name)) {
                throw new Error("'" + name + "' is already running.");
            }

            var timer = _createTimer(this, name, interval, context);
            this._timerMap.set(name, timer);

            return timer;
        },

        getTimerByName : function getTimerByName(name)
        {
            var timer = this._timerMap.get(name);

            return (timer ? timer : null);
        },

        /**
         *  @param {*} [value]
         */
        stopAll : function stopAll()
        {
            var value = arguments[0];

            var promises = [];
            this._timerMap.forEach(
                function (timer)
                {
                    promises.push(timer.stop(value));
                }
            );

            return Promise.allSettled(promises)
                .then(TimerScheduler_decorateAllSettledResults)
            ;
        },

        waitForStopAll : function waitForStopAll()
        {
            var promises = [];
            this._timerMap.forEach(
                function (timer)
                {
                    promises.push(timer.waitForStop());
                }
            );

            return Promise.allSettled(promises)
                .then(TimerScheduler_decorateAllSettledResults)
            ;
        }
    };

    function TimerScheduler_decorateAllSettledResults(states)
    {
        var results = [];
        states.forEach(
            function (state)
            {
                var result = {
                    succeeded : false,
                    error : null,
                    value : null
                };
                switch(state) {
                case "fulfilled":
                    result = state.value;
                break;
                case "rejected":
                    result = {
                        succeeded : false,
                        error : state.reason,
                        value : null
                    };
                break;
                default:
                    result = {
                        succeeded : false,
                        error : new Error("An unknown promise state has been detected."),
                        value : null
                    };
                }

                results.push(result);
            }
        );

        return results;
    }

    /**
     *  @readonly
     *  @enum {number}
     */
    var TimerState = {
        RUNNING : 0,
        STOPPING : 1,
        STOPPED : 2
    };

    /**
     *  @constructor
     */
    function Timer()
    {
        throw new Error("'Timer' cannot be directly instantiated.");
    }

    Timer.prototype = {
        constructor : Timer,

        addEventListener : function addEventListener(eventName, eventHandler)
        {
            this._eventNotifier.add(eventName, eventHandler, arguments[2]);
        },

        removeEventListener : function removeEventListener(eventName, eventHandler)
        {
            this._eventNotifier.remove(eventName, eventHandler);
        },

        /**
         *  @returns {TimerScheduler}
         */
        getTimerScheduler : function getTimerScheduler()
        {
            return this._timerScheduler;
        },

        isRunning : function isRunning()
        {
            return TimerState.RUNNING === this._state;
        },

        /**
         *  @returns {string}
         */
        getName : function getName()
        {
            return this._name;
        },

        /**
         *  @returns {number}
         */
        getInterval : function getInterval()
        {
            return this._interval;
        },

        /**
         *  @param {*} [value]
         */
        stop : function stop()
        {
            if(TimerState.RUNNING === this._state) {
                this._state = TimerState.STOPPING;

                if(this._timerId) {
                    clearTimeout(this._timerId);
                    this._timerId = null;
                }

                Timer_resolve(this, arguments[0]);
            }

            return this._promise;
        },

        waitForStop : function waitForStop()
        {
            return this._promise;
        }
    };

    /**
     *  @param {TimerScheduler} timerScheduler
     *  @param {string} name
     *  @param {number} interval
     *  @param {*} context
     */
    function _createTimer(timerScheduler, name, interval, context)
    {
        /** @type {Timer} */var timer = Object.create(Timer.prototype);

        /** @type {TimerState} */timer._state = TimerState.RUNNING;
        timer._timerScheduler = timerScheduler;
        timer._name = name;
        timer._interval = interval;
        timer._context = context;
        timer._eventNotifier = new EventNotifier();
        timer._stopValue = void 0;
        timer._timerId = null;
        timer._resolve = null;
        timer._reject = null;

        timer._promise = new Promise(
                function (resolve, reject)
                {
                    timer._resolve = resolve;
                    timer._reject = reject;

                    setTimeout(
                        function ()
                        {
                            Timer_setTimeout(timer);
                        }
                    );
                }
            )
            .then(
                function (value)
                {
                    Timer_cleanUp(timer, value, null);

                    return {
                        succeeded : true,
                        error : null,
                        context : timer._context,
                        value : value
                    };
                },
                function (error)
                {
                    Timer_cleanUp(timer, null, error);

                    return {
                        succeeded : false,
                        error : error,
                        context : timer._context,
                        value : null
                    };
                }
            )
        ;

        return timer;
    }

    /**
     *  @param {Timer} thisRef
     */
    function Timer_setTimeout(thisRef)
    {
        thisRef._timerId = setTimeout(
            function ()
            {
                switch(thisRef._state) {
                case TimerState.RUNNING:
                    thisRef._eventNotifier.dispatch(
                        "ticked",
                        {
                            source : thisRef,
                            context : thisRef._context
                        },
                        function (e)
                        {
                            if(e.error) {
                                Timer_reject(thisRef, e.error);
                            }
                            else {
                                if(TimerState.RUNNING === thisRef._state) {
                                    Timer_setTimeout(thisRef);
                                }
                                else {
                                    Timer_resolve(thisRef, thisRef._stopValue);
                                }
                            }
                        }
                    );
                break;
                case TimerState.STOPPING:
                    Timer_resolve(thisRef, thisRef._stopValue);
                break;
                default:
                    Timer_reject(
                        thisRef,
                        new Error("Timer '" + thisRef._name + "' was in an unknown state and forced to be stopped.")
                    );
                }
            },
            thisRef._interval
        );
    }

    /**
     *  @param {Timer} thisRef
     *  @param {*} value
     */
    function Timer_resolve(thisRef, value)
    {
        if(thisRef._resolve) {
            thisRef._stopValue = value;

            thisRef._resolve(value);
            thisRef._resolve = null;
        }
    }

    /**
     *  @param {Timer} thisRef
     *  @param {*} reason
     */
    function Timer_reject(thisRef, reason)
    {
        if(thisRef._reject) {
            thisRef._stopValue = reason;

            thisRef._reject(reason);
            thisRef._reject = null;
        }
    }

    /**
     *  @param {Timer} thisRef
     *  @param {*} value
     *  @param {Error | null} error
     */
    function Timer_cleanUp(thisRef, value, error)
    {
        thisRef._state = TimerState.STOPPED;
        thisRef._timerScheduler._timerMap["delete"](thisRef._name);

        thisRef._eventNotifier.dispatch(
            "stopped",
            {
                source : thisRef,
                context : thisRef._context,
                value : value,
                error : error
            }
        );

        thisRef._eventNotifier.removeAll("ticked");
        thisRef._eventNotifier.removeAll("stopped");
    }

    return {
        TimerScheduler : TimerScheduler
    };
})();
