var isIterable = require("../type-trait").isIterable;
var isCallable = require("../type-trait").isCallable;
var isSymbolSupported = require("./is-symbol-supported").isSymbolSupported;
var setAppend = require("./set-extensions").append;
var defaultEqualComparer = require("./detail").defaultEqualComparer;
var ArrayLikePairIterator = require("./array-like-iterator").ArrayLikePairIterator;
var ArrayLikeKeyIterator = require("./array-like-iterator").ArrayLikeKeyIterator;
var ArrayLikeValueIterator = require("./array-like-iterator").ArrayLikeValueIterator;

module.exports = (function ()
{
    var _isSymbolSupported = isSymbolSupported();

    /**
     *  @template T
     *  @typedef {import("./equal-comparer").EqualComparer<T>} EqualComparer<T>
     */

    /**
     *  @template T
     *  @constructor
     *  @param {Iterable<T>} [iterable]
     *  @param {EqualComparer<T>} [comparer]
     */
    function ArraySet()
    {
        /**  @type {Iterable<T>} */var iterable = arguments[0];
        /**  @type {EqualComparer<T>} */var comparer = arguments[1];

        this._comparer = isCallable(comparer) ? comparer : defaultEqualComparer;
        /**  @type {T[]} */this._elements = null;
        this.clear();

        if(isIterable(iterable)) {
            setAppend(this, iterable);
            this.size = this.getElementCount();
        }
    }

    ArraySet.prototype = {
        constructor : ArraySet,

        size : 0,

        /**
         *  @param {T[]} arr
         */
        attach : function attach(arr)
        {
            if(!Array.isArray(arr)) {
                throw new TypeError("'arr' must be an array.");
            }

            this._elements = arr;
            this.size = arr.length;
        },

        detach : function detach()
        {
            var arr = this._elements;

            this.clear();

            return arr;
        },

        /**
         *  @returns {number}
         */
        getElementCount : function getElementCount()
        {
            return this._elements.length;
        },

        /**
         *  @param {number} index
         */
        getAt : function getAt(index)
        {
            return this._elements[index];
        },

        /**
         *  @param {number} index
         *  @param {T} element
         */
        setAt : function setAt(index, element)
        {
            this._elements[index] = element;
        },

        /**
         *  @param {Function} callback
         */
        forEach : function forEach(callback)
        {
            var thisArg = arguments[1];

            for(var i = 0; i < this._elements.length; ++i) {
                callback.call(thisArg, this._elements[i], i, this);
            }
        },

        entries : function entries()
        {
            return new ArrayLikePairIterator(this._elements);
        },

        keys : function keys()
        {
            return new ArrayLikeKeyIterator(this._elements);
        },

        values : function values()
        {
            return new ArrayLikeValueIterator(this._elements);
        },

        /**
         *  @param {T} element
         *  @returns {boolean}
         */
        has : function has(element)
        {
            return this.indexOf(element) >= 0;
        },

        /**
         *  @param {Function} callback
         */
        findIndex : function findIndex(callback)
        {
            return this._elements.findIndex(callback, arguments[1]);
        },

        /**
         *  @param {T} element
         */
        indexOf : function indexOf(element)
        {
            /**  @type {EqualComparer<typeof element>} */var comparer = isCallable(arguments[1]) ? arguments[1] : this._comparer;

            for(var index = -1, i = 0; index < 0 && i < this._elements.length; ++i) {
                if(comparer(this._elements[i], element)) {
                    index = i;
                }
            }

            return index;
        },

        /**
         *  @param {T} element
         */
        add : function add(element)
        {
            this._tryAdd(element);

            return this;
        },

        /**
         *  @param {T} element
         */
        addOrReplace : function addOrReplace(element)
        {
            var index = this._tryAdd(element);
            if(index >= 0) {
                this.setAt(index, element);
            }

            return this;
        },

        /**
         *  @param {T} element
         *  @returns {boolean}
         */
        tryAdd : function tryAdd(element)
        {
            return this._tryAdd(element) < 0;
        },

        /**
         *  @param {number} index
         *  @param {T} element
         */
        insertOrReplace : function insertOrReplace(index, element)
        {
            var existingElementIndex = this.indexOf(element);

            if(existingElementIndex < 0) {
                this._elements.splice(index, 0, element);

                ++this.size;
            }
            else {
                this.setAt(existingElementIndex, element);
            }

            return this;
        },

        /**
         *  @param {number} index
         */
        removeAt : function removeAt(index)
        {
            var result = (index < this._elements.length && index >= 0);

            if(result) {
                this._elements.splice(index, 1);

                --this.size;
            }

            return result;
        },

        /**
         *  @param {T} element
         *  @returns {boolean}
         */
        "delete" : function (element)
        {
            return this.removeAt(this.indexOf(element));
        },

        clear : function clear()
        {
            /**  @type {T[]} */this._elements = [];
            this.size = 0;
        },

        toString : function toString()
        {
            return "ArraySet(" + this._elements.length + ") {" + this._elements.join(", ") + "}";
        },

        toArray : function toArray()
        {
            return this._elements.slice();
        },

        /**
         *  @private
         *  @param {T} element
         */
        _tryAdd : function _tryAdd(element)
        {
            var index = this.indexOf(element);

            if(index < 0) {
                this._elements.push(element);

                ++this.size;
            }

            return index;
        }
    };

    if(_isSymbolSupported) {
        ArraySet.prototype[Symbol.iterator] = ArraySet.prototype.values;

        ArraySet.prototype[Symbol.toStringTag] = "ArraySet";
    }

    return {
        ArraySet : ArraySet
    };
})();
