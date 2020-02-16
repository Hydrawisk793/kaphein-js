var isUndefinedOrNull = require("../type-trait").isUndefinedOrNull;
var isIterable = require("../type-trait").isIterable;
var isNumber = require("../type-trait").isNumber;
var isSymbolSupported = require("./is-symbol-supported").isSymbolSupported;

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function _assertIsKeyNumber(key)
{
    if(!isNumber(key)) {
        throw new TypeError("Only number keys are supported.");
    }
}

var toStringTag = "NumberKeyMap";

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
        key = Number(this._keys[this._keyIndex]);
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
        result.value = Number(this._keys[this._keyIndex]);
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
function NumberKeyMap()
{
    var i;
    var pair;
    var keys, key;
    var arg;

    this.clear();

    arg = arguments[0];

    if(arg instanceof NumberKeyMap) {
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
                key = pair[0];
                _assertIsKeyNumber(key);

                this.set(key, pair[1]);
            }
        }
    }
    else if(!isUndefinedOrNull(arg)) {
        if(isIterable(arg)) {
            Array.from(arg).forEach(
                function (value, key)
                {
                    _assertIsKeyNumber(key);

                    this.set(key, value);
                },
                this
            );
        }
        else {
            keys = Object.keys(arg);

            for(i = 0; i < keys.length; ++i) {
                key = Number(keys[i]);
                _assertIsKeyNumber(key);

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
NumberKeyMap.wrap = function wrap(src)
{
    var map = /**  @type {NumberKeyMap<T>} */new NumberKeyMap();
    map.attach(src);

    return map;
};

NumberKeyMap.prototype.constructor = NumberKeyMap;

NumberKeyMap.PairIterator = PairIterator;

NumberKeyMap.KeyIterator = KeyIterator;

NumberKeyMap.ValueIterator = ValueIterator;

NumberKeyMap.prototype.attach = function (obj)
{
    this._map = obj;
    this.size = this.getSize();
};

NumberKeyMap.prototype.detach = function ()
{
    var old = this._map;

    this.clear();

    return old;
};

NumberKeyMap.prototype.getSize = function ()
{
    return Object.keys(this._map).length;
};

NumberKeyMap.prototype.clear = function ()
{
    this._map = {};
    this.size = 0;
};

NumberKeyMap.prototype["delete"] = function (key)
{
    var hasKey = this.has(key);

    if(hasKey) {
        delete this._map[key];
        --this.size;
    }

    return hasKey;
};

NumberKeyMap.prototype.entries = function ()
{
    return new PairIterator(this._map);
};

NumberKeyMap.prototype.forEach = function (callback)
{
    callback = callback.bind(arguments[1]);

    var i, key;
    var keys = Object.keys(this._map);
    for(i = 0; i < keys.length; ++i) {
        key = Number(keys[i]);

        callback(this["get"](key), key, this);
    }
};

NumberKeyMap.prototype.map = function (callback)
{
    callback = callback.bind(arguments[1]);

    var results = [];
    var i, key;
    var keys = Object.keys(this._map);
    for(i = 0; i < keys.length; ++i) {
        key = Number(keys[i]);

        results.push(callback(this["get"](key), key, this));
    }

    return results;
};

NumberKeyMap.prototype["get"] = function (key)
{
    _assertIsKeyNumber(key);

    return this._map[key];
};

NumberKeyMap.prototype.has = function (key)
{
    _assertIsKeyNumber(key);

    return _hasOwnProperty.call(this._map, key);
};

NumberKeyMap.prototype.keys = function ()
{
    return new KeyIterator(this._map);
};

NumberKeyMap.prototype["set"] = function (key, value)
{
    var hasKey = this.has(key);

    this._map[key] = value;
    if(!hasKey) {
        ++this.size;
    }

    return this;
};

NumberKeyMap.prototype.values = function ()
{
    return new ValueIterator(this._map);
};

NumberKeyMap.prototype.toPlainObject = function ()
{
    var i, key;
    var iter = this.keys();
    var plainObject = {};

    for(i = iter.next(); !i.done; i = iter.next()) {
        key = Number(i.value);

        plainObject[key] = this._map[key];
    }

    return plainObject;
};

NumberKeyMap.prototype.toString = function ()
{
    return "[object " + toStringTag + "]";
};

if(isSymbolSupported()) {
    NumberKeyMap.prototype[Symbol.iterator] = NumberKeyMap.prototype.entries;

    NumberKeyMap.prototype[Symbol.toStringTag] = toStringTag;

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
    NumberKeyMap : NumberKeyMap
};
