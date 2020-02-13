var isString = require("../utils/type-trait").isString;
var isFunction = require("../utils/type-trait").isFunction;
var StringKeyMap = require("../collection").StringKeyMap;
var ArraySet = require("../collection").ArraySet;

var EventNotifier = (function ()
{
    var _Set = ((Set && "function" === typeof Set) ? Set : ArraySet);

    /**
     *  @constructor
     */
    function EventNotifier()
    {
        this._handlerSets = new StringKeyMap();
    }

    EventNotifier.prototype = {
        constructor : EventNotifier,

        add(eventName, handler)
        {
            if(!isFunction(handler)) {
                throw new TypeError("'handler' must be a function.");
            }

            EventNotifier_getHandlerSet(this, eventName, true).add(handler);

            return this;
        },

        remove(eventName, handler)
        {
            if(!isFunction(handler)) {
                throw new TypeError("'handler' must be a function.");
            }

            var handlerSet = EventNotifier_getHandlerSet(this, eventName);
            if(null !== handlerSet) {
                handlerSet["delete"](handler);
            }

            return this;
        },

        removeAll(eventName)
        {
            var handlerSet = EventNotifier_getHandlerSet(this, eventName);
            if(null !== handlerSet) {
                handlerSet.clear();
            }

            return this;
        },

        /**
         *  @param {string} eventName
         *  @param {*} [eventArgs]
         *  @returns {EventNotifier}
         */
        notify(eventName, eventArgs)
        {
            var handlerSet = EventNotifier_getHandlerSet(this, eventName);
            if(null !== handlerSet && handlerSet.size > 0) {
                for(
                    var iter = handlerSet.values(), i = iter.next();
                    !i.done;
                    i = iter.next()
                ) {
                    i.value(eventArgs);
                }
            }

            return this;
        },

        /**
         *  @param {string} eventName
         *  @param {*} [eventArgs]
         *  @returns {EventNotifier}
         */
        dispatch(eventName, eventArgs)
        {
            var handlerSet = EventNotifier_getHandlerSet(this, eventName);
            if(null !== handlerSet && handlerSet.size > 0) {
                for(
                    var iter = handlerSet.values(), i = iter.next();
                    !i.done;
                    i = iter.next()
                ) {
                    EventNotifier_dispatchHandlerAndArgs(i.value, eventArgs);
                }
            }

            return this;
        },
    };

    function EventNotifier_dispatchHandlerAndArgs(handler, eventArgs)
    {
        // The JavaScript runtime will queue the execution of the callback in the internal event queue immediately,  
        // and the callback will be pushed into the internal stack after the stack is empty.
        setTimeout(
            function ()
            {
                handler(eventArgs);
            },
            0
        );
    }

    /**
     *  @param {EventNotifier} thisRef
     *  @param {string} eventName
     *  @param {boolean} [createIfNotExists]
     */
    function EventNotifier_getHandlerSet(thisRef, eventName)
    {
        if(!isString(eventName)) {
            throw new TypeError("'eventName' must be a string.");
        }

        /** @type {Set<Function>} */var handlerSet = null;
        if(thisRef._handlerSets.has(eventName)) {
            handlerSet = thisRef._handlerSets.get(eventName);
        }
        else if(arguments[2]) {
            handlerSet = new _Set();
            thisRef._handlerSets.set(eventName, handlerSet);
        }

        return handlerSet;
    }

    return EventNotifier;
})();

module.exports = {
    EventNotifier : EventNotifier,
};
