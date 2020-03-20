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
        if("function" !== typeof executor) {
            throw new TypeError("'executor' must be a function.");
        }

        this._state = "pending";
        this._result = void 0;
        this._fulfillReactions = [];
        this._rejectReactions = [];

        var reactionFunctions = _createReactionFunctions(this);
        try {
            executor(reactionFunctions.resolve, reactionFunctions.reject);
        }
        catch(error) {
            reactionFunctions.reject(error);
        }
    }

    PseudoPromise.prototype = {
        constructor : PseudoPromise,

        _state : "pending",

        _result : void 0,

        /** @type {_Reaction[]} */_fulfillReactions : void 0,

        /** @type {_Reaction[]} */_rejectReactions : void 0,

        then : function then(onFulfilled)
        {
            if("function" !== typeof onFulfilled) {
                throw new TypeError("'onFulfilled' must be a function.");
            }

            var onRejected = arguments[1];
            if(arguments.length > 1 && "function" !== typeof onRejected) {
                throw new TypeError("'onRejected' must be a function.");
            }

            /** @type {PseudoPromise<T>} */var promise = Object.create(PseudoPromise.prototype);
            promise._fulfillReactions = [];
            promise._rejectReactions = [];

            // TODO : Write code.
            // eslint-disable-next-line no-unused-vars
            var resolveReaction = new _Reaction(promise, onFulfilled);

            // TODO : Write code.

            return promise;
        },

        // eslint-disable-next-line no-unused-vars
        "catch" : function (onRejected)
        {
            if("function" !== typeof onRejected) {
                throw new TypeError("'onRejected' must be a function.");
            }

            // TODO : Write code.

            /** @type {PseudoPromise<T>} */var promise = Object.create(PseudoPromise.prototype);
            promise._fulfillReactions = [];
            promise._rejectReactions = [];

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
     *  @template T
     *  @param {PseudoPromise<T>} thisRef
     */
    function _createReactionFunctions(thisRef)
    {
        return {
            resolve : function resolve(value)
            {
                if("pending" !== thisRef._state) {
                    throw new Error("");
                }

                thisRef._state = "fulfilled";
                thisRef._result = value;

                while(thisRef._fulfillReactions.length > 0) {
                    var reaction = thisRef._fulfillReactions.shift();
                    _queueReaction(thisRef, reaction);
                }

                thisRef._fulfillReactions = void 0;
                thisRef._rejectReactions = void 0;
            },

            reject : function reject(reason)
            {
                if("pending" !== thisRef._state) {
                    throw new Error("");
                }

                thisRef._state = "rejected";
                thisRef._state = reason;

                while(thisRef._rejectedReactions.length > 0) {
                    var reaction = thisRef._rejectedReactions.shift();
                    _queueReaction(thisRef, reaction);
                }

                thisRef._fulfillReactions = void 0;
                thisRef._rejectReactions = void 0;
            }
        };
    }

    /**
     *  @template T
     *  @constructor
     *  @param {PseudoPromise<T>} promise
     *  @param {Function} task
     */
    function _Reaction(promise, task)
    {
        this._promise = promise;
        this._task = task;
    }

    /**
     *  @template T
     *  @param {PseudoPromise<T>} thisRef
     *  @param {_Reaction<T>} reaction
     */
    function _queueReaction(thisRef, reaction)
    {
        setTimeout(
            function ()
            {
                var reactionFunctions = _createReactionFunctions(reaction._promise);

                var result = void 0;
                try {
                    result = reaction._task(thisRef._result);

                    if(_isPromiseLike(result)) {
                        result.then(
                            function (value)
                            {
                                reactionFunctions.resolve(value);
                            },
                            function (reason)
                            {
                                reactionFunctions.reject(reason);
                            }
                        );
                    }
                    else {
                        reactionFunctions.resolve(result);
                    }
                }
                catch(error) {
                    reactionFunctions.reject(error);
                }
            }
        );
    }

    /**
     *  @param {*} v
     *  @returns {v is PromiseLike<any>}
     */
    function _isPromiseLike(v)
    {
        return "object" === typeof v
            && null !== v
            && "then" in v
            && "function" === typeof v.then
    }

    return {
        PseudoPromise : PseudoPromise
    };
})();
