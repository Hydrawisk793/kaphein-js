var typeTrait = require("../type-trait");

var _assertIsKeyString = function (key)
{
    if("string" !== typeof key && !(key instanceof String)) {
        throw new TypeError("Only string keys are supported.");
    }
};

var _isSymbolSupported = function ()
{
    return ("undefined" !== typeof Symbol && "iterator" in Symbol);
};

var toStringTag = "StringKeyMap";

var PairIterator = function (map)
{
    this._map = map;
    this._keys = Object.keys(this._map);
    this._keyIndex = 0;
};

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

var KeyIterator = function (map)
{
    this._keys = Object.keys(map);
    this._keyIndex = 0;
};

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

var ValueIterator = function (map)
{
    this._map = map;
    this._keys = Object.keys(this._map);
    this._keyIndex = 0;
};

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

var StringKeyMap = function ()
{
    this.clear();

    var i;
    var pair;
    var keys, key;
    var arg = arguments[0];

    if(arg instanceof StringKeyMap) {
        arg.forEach(
            function (value, key) {
                this.set(key, value);
            },
            this
        );
    }
    else if(Array.isArray(arg)) {
        for(i = 0; i < arg.length; ++i) {
            pair = arg[i];

            if(Array.isArray(pair) && pair.length >= 2) {
                this.set(pair[0], pair[1]);
            }
        }
    }
    else if(!typeTrait.isUndefinedOrNull(arg)) {
        if(typeTrait.isIterable(arg)) {
            Array.from(arg).forEach(
                function (value, key) {
                    this.set(key, value);
                },
                this
            );
        }
        else {
            keys = Object.keys(arg);

            for(i = 0; i < keys.length; ++i) {
                key = keys[i];

                this.set(key, arg[key]);
            }
        }
    }

    this.size = Object.keys(this._map).length;
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

StringKeyMap.prototype.forEach = function (callbackFn) {
    callbackFn = callbackFn.bind(arguments[1]);

    var i, key;
    var keys = Object.keys(this._map);
    for(i = 0; i < keys.length; ++i) {
        key = keys[i];

        callbackFn(this["get"](key), key, this);
    }
}

StringKeyMap.prototype["get"] = function (key)
{
    _assertIsKeyString(key);

    return this._map[key];
};

StringKeyMap.prototype.has = function (key)
{
    _assertIsKeyString(key);

    return key in this._map;
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
    var iter = this.keys();
    var i, key;
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

if(_isSymbolSupported()) {
    StringKeyMap.prototype[Symbol.iterator] = StringKeyMap.prototype.entries;

    StringKeyMap.prototype[Symbol.toStringTag] = toStringTag;

    PairIterator.prototype[Symbol.iterator] = function () {
        return this;
    };

    KeyIterator.prototype[Symbol.iterator] = function () {
        return this;
    };

    ValueIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
}

module.exports = {
    StringKeyMap : StringKeyMap,
};
