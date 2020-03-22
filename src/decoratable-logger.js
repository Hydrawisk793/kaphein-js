var isString = require("./type-trait").isString;
var isNonNullObject = require("./type-trait").isNonNullObject;
var ArraySet = require("./collection").ArraySet;

module.exports = (function ()
{
    var _arraySlice = Array.prototype.slice;

    var _Set = ((Set && "function" === typeof Set) ? Set : ArraySet);

    /**
     *  @typedef {import("./decoratable-logger").LoggerMessageDecorator} LoggerMessageDecorator
     */

    /**
     *  @constructor
     */
    function DecoratableLogger()
    {
        /**  @type {Console|null} */this._console = null;

        /**  @type {Console|string|null} */var arg = arguments[0];
        if(isNonNullObject(arg)) {
            this._console = arg;
        }
        else if(isString(arg)) {
            throw new Error("Logging to file is not implemeted yet.");
        }

        /**  @type {Set<LoggerMessageDecorator>} */this._messageDecorators = new _Set();
    }

    DecoratableLogger.prototype = {
        constructor : DecoratableLogger,

        getMessageDecorators : function getMessageDecorators()
        {
            return Array.from(this._messageDecorators);
        },

        /**
         *  @param {LoggerMessageDecorator} messageDecorator
         */
        addMessageDecorator : function addMessageDecorator(messageDecorator)
        {
            this._messageDecorators.add(messageDecorator);
        },

        /**
         *  @param {LoggerMessageDecorator} messageDecorator
         */
        removeMessageDecorator : function removeMessageDecorator(messageDecorator)
        {
            this._messageDecorators["delete"](messageDecorator);
        },

        debug : function debug()
        {
            if(null !== this._console) {
                this._console.debug.apply(
                    this._console,
                    DecoratableLogger_decorateMessages(this, _arraySlice.call(arguments))
                );
            }
        },

        log : function log()
        {
            if(null !== this._console) {
                this._console.log.apply(
                    this._console,
                    DecoratableLogger_decorateMessages(this, _arraySlice.call(arguments))
                );
            }
        },

        info : function info()
        {
            if(null !== this._console) {
                this._console.info.apply(
                    this._console,
                    DecoratableLogger_decorateMessages(this, _arraySlice.call(arguments))
                );
            }
        },

        trace : function trace()
        {
            if(null !== this._console) {
                this._console.trace.apply(
                    this._console,
                    DecoratableLogger_decorateMessages(this, _arraySlice.call(arguments))
                );
            }
        },

        warn : function warn()
        {
            if(null !== this._console) {
                this._console.warn.apply(
                    this._console,
                    DecoratableLogger_decorateMessages(this, _arraySlice.call(arguments))
                );
            }
        },

        error : function error()
        {
            if(null !== this._console) {
                this._console.error.apply(
                    this._console,
                    DecoratableLogger_decorateMessages(this, _arraySlice.call(arguments))
                );
            }
        }
    };

    /**
     *  @param {Logger} thisRef
     *  @param {any[]} args
     */
    function DecoratableLogger_decorateMessages(thisRef, args)
    {
        var decoratedArgs = args;
        var decorators = thisRef.getMessageDecorators();
        for(var i = 0; i < decorators.length; ++i) {
            decoratedArgs = decorators[i](decoratedArgs, thisRef);
        }

        return decoratedArgs;
    }

    return {
        DecoratableLogger : DecoratableLogger
    };
})();
