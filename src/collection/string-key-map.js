var isUndefinedOrNull = require("../type-trait").isUndefinedOrNull;
var isIterable = require("../type-trait").isIterable;
var isString = require("../type-trait").isString;
var isSymbolSupported = require("./is-symbol-supported").isSymbolSupported;

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function _assertIsKeyString(key)
{
    if(!isString(key)) {
        throw new TypeError("Only string keys are supported.");
    }
}

var toStringTag = "StringKeyMap";

function PairIterator(map)
{
    this._map = map;
    this._keys = Object.keys(this._map);
    this._keyIndex = 0;
}

PairIterator.prototype.constructor = PairIterator;

PairIterator.prototype.next = function ()
{
    var key;
    var result = {
        value : void 0,
        done : this._keyIndex >= this._keys.length
    };

    if(!result.done) {
        key = "" + this._keys[this._keyIndex];
        result.value = [key, this._map[key]];
        ++this._keyIndex;
    }

    return result;
};

function KeyIterator(map)
{
    this._keys = Object.keys(map);
    this._keyIndex = 0;
}

KeyIterator.prototype.constructor = KeyIterator;

KeyIterator.prototype.next = function ()
{
    var result = {
        value : void 0,
        done : this._keyIndex >= this._keys.length
    };

    if(!result.done) {
        result.value = "" + this._keys[this._keyIndex];
        ++this._keyIndex;
    }

    return result;
};

function ValueIterator(map)
{
    this._map = map;
    this._keys = Object.keys(this._map);
    this._keyIndex = 0;
}

ValueIterator.prototype.constructor = ValueIterator;

ValueIterator.prototype.next = function ()
{
    var key;
    var result = {
        value : void 0,
        done : this._keyIndex >= this._keys.length
    };

    if(!result.done) {
        key = this._keys[this._keyIndex];
        result.value = this._map[key];
        ++this._keyIndex;
    }

    return result;
};

/**
 *  @constructor
 */
function StringKeyMap()
{
    var i;
    var pair;
    var keys, key;
    var arg;

    this.clear();

    arg = arguments[0];

    if(arg instanceof StringKeyMap) {
        arg.forEach(
            function (value, key)
            {
                this.set(key, value);
            },
            this
        );
    }
    else if(Array.isArray(arg)) {
        for(i = 0; i < arg.length; ++i) {
            pair = arg[i];

            if(Array.isArray(pair) && pair.length >= 2) {
                _assertIsKeyString(pair[0]);

                this.set(pair[0], pair[1]);
            }
        }
    }
    else if(!isUndefinedOrNull(arg)) {
        if(isIterable(arg)) {
            Array.from(arg).forEach(
                function (value, key)
                {
                    _assertIsKeyString(key);

                    this.set(key, value);
                },
                this
            );
        }
        else {
            keys = Object.keys(arg);

            for(i = 0; i < keys.length; ++i) {
                key = keys[i];
                _assertIsKeyString(key);

                this.set(key, arg[key]);
            }
        }
    }

    this.size = Object.keys(this._map).length;
}

/**
 *  @template T
 *  @param {Record<number, T>} src
 */
StringKeyMap.wrap = function wrap(src)
{
    var map = /** @type {StringKeyMap<T>} */new StringKeyMap();
    map.attach(src);

    return map;
};

StringKeyMap.prototype.constructor = StringKeyMap;

StringKeyMap.PairIterator = PairIterator;

StringKeyMap.KeyIterator = KeyIterator;

StringKeyMap.ValueIterator = ValueIterator;

StringKeyMap.prototype.attach = function (obj)
{
    this._map = obj;
    this.size = this.getSize();
};

StringKeyMap.prototype.detach = function ()
{
    var old = this._map;

    this.clear();

    return old;
};

StringKeyMap.prototype.getSize = function ()
{
    return Object.keys(this._map).length;
};

StringKeyMap.prototype.clear = function ()
{
    this._map = {};
    this.size = 0;
};

StringKeyMap.prototype["delete"] = function (key)
{
    var hasKey = this.has(key);

    if(hasKey) {
        delete this._map[key];
        --this.size;
    }

    return hasKey;
};

StringKeyMap.prototype.entries = function ()
{
    return new PairIterator(this._map);
};

StringKeyMap.prototype.forEach = function (callback)
{
    callback = callback.bind(arguments[1]);

    var i, key;
    var keys = Object.keys(this._map);
    for(i = 0; i < keys.length; ++i) {
        key = keys[i];

        callback(this["get"](key), key, this);
    }
};

StringKeyMap.prototype.map = function (callback)
{
    callback = callback.bind(arguments[1]);

    var results = [];
    var i, key;
    var keys = Object.keys(this._map);
    for(i = 0; i < keys.length; ++i) {
        key = keys[i];

        results.push(callback(this["get"](key), key, this));
    }

    return results;
};

StringKeyMap.prototype["get"] = function (key)
{
    _assertIsKeyString(key);

    return this._map[key];
};

StringKeyMap.prototype.has = function (key)
{
    _assertIsKeyString(key);

    return _hasOwnProperty.call(this._map, key);
};

StringKeyMap.prototype.keys = function ()
{
    return new KeyIterator(this._map);
};

StringKeyMap.prototype["set"] = function (key, value)
{
    var hasKey = this.has(key);

    this._map[key] = value;
    if(!hasKey) {
        ++this.size;
    }

    return this;
};

StringKeyMap.prototype.values = function ()
{
    return new ValueIterator(this._map);
};

StringKeyMap.prototype.toPlainObject = function ()
{
    var i, key;
    var iter = this.keys();
    var plainObject = {};

    for(i = iter.next(); !i.done; i = iter.next()) {
        key = i.value

        plainObject[key] = this._map[key];
    }

    return plainObject;
};

StringKeyMap.prototype.toString = function ()
{
    return "[object " + toStringTag + "]";
};

if(isSymbolSupported()) {
    StringKeyMap.prototype[Symbol.iterator] = StringKeyMap.prototype.entries;

    StringKeyMap.prototype[Symbol.toStringTag] = toStringTag;

    PairIterator.prototype[Symbol.iterator] = function ()
    {
        return this;
    };

    KeyIterator.prototype[Symbol.iterator] = function ()
    {
        return this;
    };

    ValueIterator.prototype[Symbol.iterator] = function ()
    {
        return this;
    };
}

module.exports = {
    StringKeyMap : StringKeyMap
};
