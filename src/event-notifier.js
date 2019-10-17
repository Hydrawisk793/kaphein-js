var typeTrait = require("./type-trait");
var isUndefinedOrNull = typeTrait.isUndefinedOrNull;
var isString = typeTrait.isString;
var isFunction = typeTrait.isFunction;

var assertParameterIsString = function (name, value)
{
    if(!isString(value)) {
        throw new TypeError("'" + name + "' must be a string.");
    }
};

var assertParameterIsFunction = function (name, value)
{
    if(!isFunction(value)) {
        throw new TypeError("'" + name + "' must be a function.");
    }
};

/**
 * @param {*} options
 * @returns {NodeJS.Global|Window}
 */
var findGlobal = function (options)
{
    var _global;

    if("global" in options) {
        _global = options["global"];
    }
    else {
        _global = (
            "undefined" !== typeof window
            ? /** @type {Window} */window
            : global
        );
    }

    return _global;
};

/**
 * @param {string} className
 * @param {NodeJS.Global|Window} globalObj
 * @param {*} options
 * @returns {Function}
 */
var findClass = function (className, globalObj, options)
{
    var klass = (
        (className in options)
        ? options[className]
        : globalObj[className]
    );
    if("function" !== typeof klass) {
        throw new Error("Failed to find the constructor of '" + className + "' class. Please provide a suitable one via 'options' parameter.");
    }

    return klass;
};

var EventNotifier = function (options)
{
    if(isUndefinedOrNull(options)) {
        options = {};
    }

    var _global = findGlobal(options);

    /** @type {MapConstructor} */this._Map = findClass("Map", _global, options);
    /** @type {SetConstructor} */this._Set = findClass("Set", _global, options);
    /** @type {SymbolConstructor} */this._Symbol = findClass("Symbol", _global, options);

    /** @type {Map<string, Set<Function>>} */ this._handlerSets = new this._Map();
};
EventNotifier.prototype.constructor = EventNotifier;

EventNotifier.prototype.add = function (eventName, handler)
{
    assertParameterIsFunction("handler", handler);

    this._getHandlerSet(eventName).add(handler);

    return this;
};

EventNotifier.prototype.remove = function (eventName, handler)
{
    assertParameterIsFunction("handler", handler);

    this._getHandlerSet(eventName)["delete"](handler);

    return this;
};

EventNotifier.prototype.removeAll = function (eventName)
{
    this._getHandlerSet(eventName).clear();

    return this;
};

/**
 * @param {string} eventName
 * @param {*} [eventArgs]
 * @returns {EventNotifier}
 */
EventNotifier.prototype.notify = function (eventName, eventArgs)
{
    var i;
    var handler;
    var handlerSet = this._getHandlerSet(eventName);

    var iter = handlerSet[this._Symbol.iterator]();
    if(!isUndefinedOrNull(iter)) {
        for(i = iter.next(); !i.done; i = iter.next()) {
            handler = i.value;

            if(isFunction(handler)) {
                handler(eventArgs);
            }
        }
    }

    return this;
}

/**
 * @param {string} eventName
 * @returns {Set<Function>}
 */
EventNotifier.prototype._getHandlerSet = function (eventName)
{
    assertParameterIsString("eventName", eventName);

    /** @type {Set<Function>} */ var handlerSet = null;
    if(this._handlerSets.has(eventName)) {
        handlerSet = this._handlerSets.get(eventName);
    }
    else {
        handlerSet = new this._Set();
        this._handlerSets.set(eventName, handlerSet);
    }

    return handlerSet;
};

module.exports = {
    EventNotifier : EventNotifier
};
