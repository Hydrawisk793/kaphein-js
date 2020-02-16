var isString = require("./type-trait").isString;
var isFunction = require("./type-trait").isFunction;
var StringKeyMap = require("./collection").StringKeyMap;
var ArrayMap = require("./collection").ArrayMap;

var EventNotifier = (function ()
{
    var _Map = ((Map && "function" === typeof Map) ? Map : ArrayMap);

    /**
     *  @typedef {{
            handler : Function;
            once : boolean;
        }} HandlerDescriptor
     */

    /**
     *  @constructor
     */
    function EventNotifier()
    {
        /** @type {Map<string, Map<Function, HandlerDescriptor>>} */this._handlerMaps = new StringKeyMap();
    }

    EventNotifier.prototype = {
        constructor : EventNotifier,

        getHandlerCountOf : function getHandlerCountOf(eventName)
        {
            var count = 0;

            var handlerMap = EventNotifier_getHandlerMap(this, eventName);
            if(null !== handlerMap) {
                count = handlerMap.size;
            }

            return count;
        },

        add : function add(eventName, handler)
        {
            if(!isFunction(handler)) {
                throw new TypeError("'handler' must be a function.");
            }

            var option = arguments[2] ? arguments[2] : {};

            var handlerMap = EventNotifier_getHandlerMap(this, eventName, true);
            if(!handlerMap.has(handler)) {
                handlerMap.set(
                    handler,
                    {
                        handler : handler,
                        once : option.once
                    }
                );
            }

            return this;
        },

        remove : function remove(eventName, handler)
        {
            if(!isFunction(handler)) {
                throw new TypeError("'handler' must be a function.");
            }

            var handlerMap = EventNotifier_getHandlerMap(this, eventName);
            if(null !== handlerMap) {
                handlerMap["delete"](handler);
            }

            return this;
        },

        removeAll : function removeAll(eventName)
        {
            var handlerMap = EventNotifier_getHandlerMap(this, eventName);
            if(null !== handlerMap) {
                handlerMap.clear();
            }

            return this;
        },

        /**
         *  @param {string} eventName
         *  @param {*} [eventArgs]
         */
        notify : function notify(eventName, eventArgs)
        {
            /** @type {any[]} */var results = [];

            var handlerMap = EventNotifier_getHandlerMap(this, eventName);
            if(null !== handlerMap && handlerMap.size > 0) {
                var handlersToBeRemoved = [];
                var i = 0;

                var descriptors = Array.from(handlerMap.values());
                for(i = 0; i < descriptors.length; ++i) {
                    var descriptor = descriptors[i];
                    var handler = descriptor.handler;

                    if(descriptor.once) {
                        handlersToBeRemoved.push(handler);
                    }

                    results.push(handler(eventArgs));
                }

                for(i = 0; i < handlersToBeRemoved.length; ++i) {
                    handlerMap["delete"](handlersToBeRemoved[i]);
                }
            }

            return results;
        },

        /**
         *  @param {string} eventName
         *  @param {*} [eventArgs]
         */
        dispatch : function dispatch(eventName, eventArgs)
        {
            var handlerMap = EventNotifier_getHandlerMap(this, eventName);
            if(null !== handlerMap && handlerMap.size > 0) {
                var handlersToBeRemoved = [];
                var i = 0;

                var descriptors = Array.from(handlerMap.values());
                for(i = 0; i < descriptors.length; ++i) {
                    var descriptor = descriptors[i];
                    var handler = descriptor.handler;

                    if(descriptor.once) {
                        handlersToBeRemoved.push(handler);
                    }

                    EventNotifier_dispatchHandlerAndArgs(handler, eventArgs);
                }

                for(i = 0; i < handlersToBeRemoved.length; ++i) {
                    handlerMap["delete"](handlersToBeRemoved[i]);
                }
            }

            return this;
        }
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
    function EventNotifier_getHandlerMap(thisRef, eventName)
    {
        if(!isString(eventName)) {
            throw new TypeError("'eventName' must be a string.");
        }

        /** @type {Map<Function, HandlerDescriptor> | null} */var handlerMap = null;
        if(thisRef._handlerMaps.has(eventName)) {
            handlerMap = thisRef._handlerMaps.get(eventName);
        }
        else if(arguments[2]) {
            handlerMap = new _Map();
            thisRef._handlerMaps.set(eventName, handlerMap);
        }

        return handlerMap;
    }

    return EventNotifier;
})();

module.exports = {
    EventNotifier : EventNotifier
};