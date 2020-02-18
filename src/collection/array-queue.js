var isIterable = require("../type-trait").isIterable;
var forOf = require("./utils").forOf;
var isSymbolSupported = require("./is-symbol-supported").isSymbolSupported;
var ArrayLikePairIterator = require("./array-like-iterator").ArrayLikePairIterator;
var ArrayLikeKeyIterator = require("./array-like-iterator").ArrayLikeKeyIterator;
var ArrayLikeValueIterator = require("./array-like-iterator").ArrayLikeValueIterator;

module.exports = (function ()
{
    /**
     *  @template T
     *  @constructor
     */
    function ArrayQueue()
    {
        /** @type {T[]} */this._elements = [];
        this.size = 0;

        this.clear();

        var iterable = arguments[0];
        if(isIterable(iterable)) {
            forOf(
                iterable,
                /**
                 *  @this {ArrayQueue<T>}
                 */
                function (value)
                {
                    this.enqueue(value);
                },
                this
            );
        }
    }

    ArrayQueue.prototype = {
        constructor : ArrayQueue,

        size : 0,

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

        isEmpty : function isEmpty()
        {
            return this.size < 1;
        },

        /**
         *  @param {T} v
         */
        enqueue : function enqueue(v)
        {
            this._elements.push(v);
            ++this.size;
        },

        /**
         *  @returns {T | undefined}
         */
        dequeue : function dequeue()
        {
            var elem = void 0;

            if(!this.isEmpty()) {
                elem = this._elements.shift();
                --this.size;
            }

            return elem;
        },

        clear : function clear()
        {
            this._elements = [];
            this.size = 0;
        }
    };

    if(isSymbolSupported()) {
        ArrayQueue.prototype[Symbol.iterator] = ArrayQueue.prototype.values;

        ArrayQueue.prototype[Symbol.toStringTag] = "ArrayQueue";
    }

    return {
        ArrayQueue : ArrayQueue
    };
})();
