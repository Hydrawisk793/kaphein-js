var isFunction = require("../type-trait").isFunction;
var isPromiseLike = require("../type-trait").isPromiseLike;
var EventNotifier = require("../event-notifier").EventNotifier;

module.exports = (function ()
{
    /**
     *  @template {any} T
     *  @constructor
     *  @param {(
            resolve : (value : T) => void,
            reject : (reason : any) => void
        ) => void} executor
    */
    function PseudoPromise(executor)
    {
        if(!(this instanceof PseudoPromise)) {
            throw new Error("An invalid promise constructor call.");
        }

        if(!isFunction(executor)) {
            throw new TypeError("'executor' must be a function.");
        }

        PseudoPromise_init.call(this);

        try {
            executor(this._resolve, this._reject);
        }
        catch(error) {
            this._reject(error);
        }
    }

    /**
     *  @template {any} T
     *  @this {PseudoPromise<T>}
     */
    function PseudoPromise_init()
    {
        // PseudoPromise._register(this);

        this._state = "pending";
        this._result = null;
        this._resolve = PseudoPromise_resolve.bind(this);
        this._reject = PseudoPromise_reject.bind(this);
        this._eventNotifier = new EventNotifier();
    }

    PseudoPromise.prototype = {
        constructor : PseudoPromise,

        then : function then(onFulfilled)
        {
            var promise = /** @type {PseudoPromise} */(Object.create(PseudoPromise.prototype));
            PseudoPromise_init.call(promise);

            console.log("then", "this._eventNotifier.add");

            var onRejected = arguments[1];
            this._eventNotifier.add(
                "_onResolved",
                PseudoPromise_createHandler(promise, onFulfilled),
                { once : true }
            );
            this._eventNotifier.add(
                "_onRejected",
                PseudoPromise_createHandler(promise, onRejected),
                { once : true }
            );

            return promise;
        },
    
        // eslint-disable-next-line no-unused-vars
        "catch" : function (onRejected)
        {
            var promise = /** @type {PseudoPromise} */(Object.create(PseudoPromise.prototype));
            PseudoPromise_init.call(promise);

            this._eventNotifier.add(
                "_onResolved",
                function (p)
                {
                    promise._resolve(p._result);
                },
                { once : true }
            );
            this._eventNotifier.add(
                "_onRejected",
                PseudoPromise_createHandler(promise, onRejected),
                { once : true }
            );

            return promise;
        }
    };

    PseudoPromise.resolve = function resolve(value)
    {
        return new PseudoPromise(
            function (resolve)
            {
                return resolve(value);
            }
        );
    };

    PseudoPromise.reject = function reject(reason)
    {
        return new PseudoPromise(
            function (resolve, reject)
            {
                return reject(reason);
            }
        );
    };

    PseudoPromise.race = function race(/*iterable*/)
    {
        throw new Error("Not implemented yet.");
    };

    PseudoPromise.all = function all(/*iterable*/)
    {
        throw new Error("Not implemented yet.");
    };

    PseudoPromise.allSettled = function allSettled(/*iterable*/)
    {
        throw new Error("Not implemented yet.");
    };

    /**
     *  @template {any} T
     *  @this {PseudoPromise}
     *  @param {T} value
     */
    function PseudoPromise_resolve(value)
    {
        this._result = value;
        this._state = "resolved";

        console.log("PseudoPromise_resolve");

        var thisRef = this;
        setTimeout(
            function ()
            {
                thisRef._eventNotifier.dispatch(
                    "_onResolved",
                    thisRef
                );
            }
        );
    }

    /**
     *  @this {PseudoPromise}
     */
    function PseudoPromise_reject(reason)
    {
        this._result = reason;
        this._state = "rejected";

        console.log("PseudoPromise_reject");

        var thisRef = this;
        setTimeout(
            function ()
            {
                thisRef._eventNotifier.dispatch(
                    "_onRejected",
                    thisRef
                );
            }
        );
    }

    /**
     *  @template T
     *  @param {PseudoPromise<T>} promise
     *  @param {Function} handler
     */
    function PseudoPromise_createHandler(promise, handler)
    {
        return function (p)
        {
            var value = p._result;

            if(isFunction(handler)) {
                try {
                    var returnValue = handler(value);
                    if(isPromiseLike(returnValue)) {
                        returnValue.then(
                            function (value)
                            {
                                promise._resolve(value);
                            },
                            PseudoPromise_createHandler(promise, handler)
                        );
                    }
                    else {
                        promise._resolve(returnValue);
                    }
                }
                catch(error) {
                    promise._reject(value);
                }
            }
            else {
                promise._reject(value);
            }
        };
    }

    return {
        PseudoPromise : PseudoPromise
    };
})();
