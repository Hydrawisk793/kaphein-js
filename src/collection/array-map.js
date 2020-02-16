var isUndefined = require("../type-trait").isUndefined;
var isIterable = require("../type-trait").isIterable;
var isCallable = require("../type-trait").isCallable;
var isSymbolSupported = require("./is-symbol-supported").isSymbolSupported;
var defaultEqualComparer = require("./detail").defaultEqualComparer;

var ArrayMap = (function ()
{
    var _isSymbolSupported = isSymbolSupported();

    /**
     *  @template K
     *  @typedef {import("./equal-comparer").EqualComparer<K>} EqualComparer
     */

    /**
     *  @template K, V
     *  @param {Map<K, V>} mapObj
     *  @param {Iterable<[K, V]>} iterable
     */
    function _addRange(mapObj, iterable)
    {
        if(!isIterable(iterable)) {
            throw new TypeError("Parameter 'iterable' must have a property 'Symbol.iterator'.");
        }

        for(
            var i = iterable[Symbol.iterator](), iP = i.next();
            !iP.done;
            iP = i.next()
        ) {
            mapObj.set(iP.value[0], iP.value[1]);
        }

        return mapObj;
    }

    /**
     *  @template K, V
     *  @constructor
     *  @param {Iterable<[K, V]>} [iterable]
     *  @param {EqualComparer<K>} [keyEqualComparer]
     */
    function ArrayMap()
    {
        var iterable = arguments[0];
        var keyEqualComparer = arguments[1];

        this._keyEqualComparer = isCallable(keyEqualComparer) ? keyEqualComparer : defaultEqualComparer;
        /**  @type {[K, V][]} */this._pairs = null;
        this.clear();

        if(isIterable(iterable)) {
            _addRange(this, iterable);

            this.size = this.getElementCount();
        }
    }

    ArrayMap.prototype = {
        constructor : ArrayMap,

        size : 0,

        /**
         *  @returns {number}
         */
        getElementCount : function getElementCount()
        {
            return this._pairs.length;
        },

        /**
         *  @param {Function} callback
         */
        forEach : function forEach(callback)
        {
            var thisArg = arguments[1];

            for(var count = this._pairs.length, i = 0; i < count; ++i) {
                var pair = this._pairs[i];
                callback.call(thisArg, pair[1], pair[0], this);
            }
        },

        /**
         *  @returns {PairIterator<K, V>}
         */
        entries : function entries()
        {
            return new PairIterator(this);
        },

        /**
         *  @returns {KeyIterator<K>}
         */
        keys : function keys()
        {
            return new KeyIterator(this);
        },

        /**
         *  @returns {ValueIterator<V>}
         */
        values : function values()
        {
            return new ValueIterator(this);
        },

        /**
         *  @param {K} key
         *  @returns {boolean}
         */
        has : function has(key)
        {
            return this.indexOf(key) >= 0;
        },

        /**
         *  @param {Function} callback
         *  @param {*} [thisArg]
         */
        findIndex : function findIndex(callback)
        {
            return this._pairs.findIndex(callback, arguments[1]);
        },

        /**
         *  @param {K} key
         */
        indexOf : function indexOf(key)
        {
            for(var count = this._pairs.length, index = -1, i = 0; index < 0 && i < count; ++i) {
                if(this._keyEqualComparer(this._pairs[i][0], key)) {
                    index = i;
                }
            }

            return index;
        },

        /**
         *  @param {K} key
         *  @param {V} [defaultValue]
         *  @returns {V}
         */
        get : function get(key)
        {
            var index = this.indexOf(key);

            return (
                index >= 0
                ? this._pairs[index][1]
                : arguments[1]
            );
        },

        /**
         *  @param {number} index
         *  @returns {[K, V]}
         */
        getAt : function getAt(index)
        {
            if(!Number.isSafeInteger(index) || index < 0) {
                throw new TypeError("'index' must be a non-negative safe integer.");
            }
            else if(index >= this._pairs.length) {
                throw new RangeError("'index' must be in range [0, " + this._pairs.length + ").");
            }

            return this._pairs[index].slice();
        },

        /**
         *  @param {K} key
         *  @param {V} value
         */
        set : function set(key, value)
        {
            var index = this.indexOf(key);

            if(index >= 0) {
                this._pairs[index][1] = value;
            }
            else {
                this._pairs.push([key, value]);

                ++this.size;
            }

            return this;
        },

        /**
         *  @param {K} key
         *  @returns {boolean}
         */
        "delete" : function (key)
        {
            var index = this.indexOf(key);
            var result = index >= 0;
            if(result) {
                this._pairs.splice(index, 1);

                --this.size;
            }

            return result;
        },

        clear : function clear()
        {
            this._pairs = [];
            this.size = 0;
        },

        toArray : function toArray()
        {
            return this._pairs.slice();
        }
    };

    if(_isSymbolSupported) {
        ArrayMap.prototype[Symbol.iterator] = function ()
        {
            return new PairIterator(this);
        };

        ArrayMap.prototype[Symbol.toStringTag] = "ArrayMap";
    }

    /**
     *  @template K, V
     *  @param {ArrayMap<K, V>} arrayMap
     *  @param {number} [index = 0]
     */
    function PairIterator(arrayMap)
    {
        this._arrayMap = arrayMap;
        this._index = isUndefined(arguments[1]) ? 0 : arguments[1];
    }

    /**
     *  @returns {IteratorReturnResult<[K, V]>}
     */
    PairIterator.prototype.next = function ()
    {
        var result = {
            done : this._index >= this._arrayMap._pairs.length,
            value : void 0
        };

        if(!result.done) {
            result.value = this._arrayMap._pairs[this._index].slice();

            ++this._index;
        }

        return result;
    };

    if(_isSymbolSupported) {
        PairIterator.prototype[Symbol.iterator] = function ()
        {
            return this;
        };
    }

    /**
     *  @template K, V
     *  @param {ArrayMap<K, V>} arrayMap
     *  @param {number} [index = 0]
     */
    function KeyIterator(arrayMap)
    {
        this._arrayMap = arrayMap;
        this._index = isUndefined(arguments[1]) ? 0 : arguments[1];
    }

    /**
     *  @returns {IteratorReturnResult<K>}
     */
    KeyIterator.prototype.next = function ()
    {
        var result = {
            done : this._index >= this._arrayMap._pairs.length,
            value : void 0
        };

        if(!result.done) {
            result.value = this._arrayMap._pairs[this._index][0];

            ++this._index;
        }

        return result;
    };

    if(_isSymbolSupported) {
        KeyIterator.prototype[Symbol.iterator] = function ()
        {
            return this;
        };
    }

    /**
     *  @template K, V
     *  @param {ArrayMap<K, V>} arrayMap
     *  @param {number} [index = 0]
     */
    function ValueIterator(arrayMap)
    {
        this._arrayMap = arrayMap;
        this._index = isUndefined(arguments[1]) ? 0 : arguments[1];
    }

    /**
     *  @returns {IteratorReturnResult<V>}
     */
    ValueIterator.prototype.next = function ()
    {
        var out = {
            done : this._index >= this._arrayMap._pairs.length,
            value : void 0
        };

        if(!out.done) {
            out.value = this._arrayMap._pairs[this._index][1];

            ++this._index;
        }

        return out;
    };

    if(_isSymbolSupported) {
        ValueIterator.prototype[Symbol.iterator] = function ()
        {
            return this;
        };
    }

    return ArrayMap;
})();

module.exports = {
    ArrayMap : ArrayMap
};
