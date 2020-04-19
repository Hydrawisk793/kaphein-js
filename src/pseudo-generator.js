var isNonNullObject = require("./type-trait").isNonNullObject;

module.exports = (function ()
{
    var _isSymbolSupported = "function" === typeof Symbol;

    /**
     *  @param {*} v
     *  @returns {v is PromiseLike}
     */
    function _isPromiseLike(v)
    {
        return isNonNullObject(v)
            && "then" in v
            && "function" === typeof v.then
        ;
    }

    /**
     *  @template State, Args, T, TReturn, TNext
     *  @typedef {import("./pseudo-generator").PseudoGeneratorContext<State, Args, T, TReturn, TNext>} PseudoGeneratorContext
     */
    /**
     *  @template State, Args, T, TReturn, TNext
     *  @typedef {import("./pseudo-generator").PseudoAsyncGeneratorExecutor<State, Args, T, TReturn, TNext>} PseudoAsyncGeneratorExecutor
     */

    /**
     *  @template State, Args, T, TReturn, TNext
     *  @constructor
     *  @param {PseudoAsyncGeneratorExecutor<State, Args, T, TReturn, TNext>} executor
     *  @param {Args} args
     *  @param {*} [option]
     */
    function PseudoAsyncGenerator(executor, args)
    {
        var option = Object.assign(
            {
                Promise : ("undefined" === typeof Promise ? null : Promise)
            },
            arguments[2]
        );

        /** @type {PromiseConstructor} */this._Promise = option.Promise;
        if(!this._Promise) {
            throw new TypeError("A proper implementation of ES 6 Promise must be provided.");
        }

        this._executor = executor;
        /** @type {Generator | AsyncGenerator} */this._delegated = null;
        this._done = false;
        /** @type {Promise<IteratorResult<T, TReturn>>} */this._promise = _createResolvedPromise(this);
        /** @type {TReturn} */this._returnValue = void 0;
        this._thrownError = void 0;

        var thisRef = this;
        /** @type {PseudoGeneratorContext<State, Args, T, TReturn, TNext>} */this._context = {
            state : {},
            args : args || [],
            lastYieldedValue : void 0,
            nextArgs : [],
            /**
             *  @param {Generator | AsyncGenerator} generator
             */
            delegate : function delegate(generator)
            {
                if(!isNonNullObject(generator)) {
                    throw new TypeError("'generator' must satisfy 'Generator' or 'AsyncGenerator'.");
                }

                thisRef._delegated = generator;
            },
            finish : function finish()
            {
                thisRef._done = true;
            }
        };
    }

    PseudoAsyncGenerator.prototype = {
        constructor : PseudoAsyncGenerator,

        /**
         *  @type {AsyncGenerator<T, TReturn, TNext>["next"]}
         */
        next : function next()
        {
            var nextArgs = arguments;
            var thisRef = this;

            var finalPromise = this._promise
                .then(
                    function ()
                    {
                        return (
                            thisRef._delegated
                            ? _callDelegatedGenerator(thisRef, nextArgs)
                            : _callExecutor(thisRef, nextArgs)
                        )
                    }
                )
                .catch(
                    function (error)
                    {
                        thisRef._thrownError = error;
                        thisRef._done = true;

                        throw error;
                    }
                )
            ;
            this._promise = finalPromise;

            return finalPromise;
        },

        /**
         *  @type {AsyncGenerator<T, TReturn, TNext>["return"]}
         */
        "return" : function (value)
        {
            var thisRef = this;

            return this._promise
                .then(
                    function ()
                    {
                        return value;
                    }
                )
                .then(
                    function (value)
                    {
                        thisRef._returnValue = value;
                        thisRef._done = true;

                        return {
                            value : value,
                            done : thisRef._done
                        };
                    }
                )
            ;
        },

        /**
         *  @type {AsyncGenerator<T, TReturn, TNext>["throw"]}
         */
        "throw" : function (e)
        {
            var thisRef = this;

            return this._promise
                .then(
                    function ()
                    {
                        thisRef._thrownError = e;
                        thisRef._done = true;

                        throw e;
                    }
                )
            ;
        }
    };

    if(_isSymbolSupported && "asyncIterator" in Symbol) {
        PseudoAsyncGenerator.prototype[Symbol.asyncIterator] = function ()
        {
            return this;
        };
    }

    /**
     *  @template State, Args, T, TReturn, TNext
     *  @param {PseudoAsyncGenerator<State, Args, T, TReturn, TNext} thisRef
     *  @param {any[]} nextArgs
     */
    function _callExecutor(thisRef, nextArgs)
    {
        return _createResolvedPromise(thisRef)
            .then(
                function ()
                {
                    thisRef._context.nextArgs = nextArgs;

                    var value = void 0;
                    if(!thisRef._done) {
                        value = (0, thisRef._executor)(thisRef._context);
                    }

                    return value;
                }
            )
            .then(
                /**
                 *  @param {T} value
                 */
                function (value)
                {
                    var result = null;

                    if(thisRef._delegated) {
                        result = _callDelegatedGenerator(thisRef);
                    }
                    else {
                        if(thisRef._done) {
                            thisRef._context.lastYieldedValue = void 0;
                            thisRef._returnValue = value;
                        }
                        else {
                            thisRef._context.lastYieldedValue = value;
                        }

                        result = /** @type {IteratorResult<T>} */({
                            value : value,
                            done : thisRef._done
                        });
                    }

                    return result;
                }
            )
        ;
    }

    /**
     *  @template State, Args, T, TReturn, TNext
     *  @param {PseudoAsyncGenerator<State, Args, T, TReturn, TNext} thisRef
     *  @param {any[]} nextArgs
     */
    function _callDelegatedGenerator(thisRef)
    {
        var nextArgs = arguments[1];

        return _createResolvedPromise(thisRef)
            .then(
                function ()
                {
                    return thisRef._delegated.next.apply(thisRef._delegated, nextArgs);
                }
            )
            .then(
                /**
                 *  @param {IteratorResult<any>} iterResult
                 */
                function (iterResult)
                {
                    return (
                        _isPromiseLike(iterResult.value)
                        ? iterResult.value
                            .then(
                                function (value)
                                {
                                    return /** @type {IteratorResult<any>} */({
                                        value : value,
                                        done : iterResult.done
                                    });
                                }
                            )
                        : iterResult
                    );
                }
            )
            .then(
                function (iterResult)
                {
                    var finalIterResult = iterResult;
                    if(iterResult.done) {
                        thisRef._context.lastYieldedValue = iterResult.value;
                        thisRef._delegated = null;

                        finalIterResult = _callExecutor(thisRef, nextArgs);
                    }

                    return finalIterResult;
                }
            )
        ;
    }

    /**
     *  @template State, Args, T, TReturn, TNext
     *  @param {PseudoAsyncGenerator<State, Args, T, TReturn, TNext} thisRef
     */
    function _createResolvedPromise(thisRef)
    {
        return new thisRef._Promise(
            function (resolve)
            {
                resolve();
            }
        );
    }

    /**
     *  @template T, TReturn, TNext
     *  @param {(...args : any[] | [TNext]) => T} func
     *  @param {*} [option]
     */
    function createPseudoAsyncGeneratorFunction(func)
    {
        var option = arguments[2];

        /**
         *  @template {any[]} Args
         *  @param {Args} args
         *  @returns {AsyncGenerator<T, TReturn, TNext>}
         */
        function pseudoAsyncGenerator(args)
        {
            return new PseudoAsyncGenerator(func, args, option);
        }

        return pseudoAsyncGenerator;
    }

    return {
        createPseudoAsyncGeneratorFunction : createPseudoAsyncGeneratorFunction
    };
})();
