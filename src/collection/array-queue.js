var isSymbolSupported = require("./is-symbol-supported").isSymbolSupported;

var ArrayQueue = (function ()
{
    /**
     *  @template T
     *  @constructor
     */
    function ArrayQueue()
    {
        this.clear();
    }

    /**
     *  @template T
     */
    ArrayQueue.prototype = {
        constructor : ArrayQueue,

        entries : function entries()
        {
            return new PairIterator(this._elements);
        },

        /**
         *  @param {T} v
         */
        enqueue : function enqueue(v)
        {
            this._elements.splice(this._elements.length, 0, v);
            ++this.size;
        },

        dequeue : function dequeue()
        {
            var elem;

            if(this.size < 1) {
                throw new Error("");
            }

            elem = this._elements.splice(0, 1);
            --this.size;

            return elem[0];
        },

        clear : function clear()
        {
            this._elements = [];
            this.size = 0;
        }
    };

    if(isSymbolSupported()) {
        ArrayQueue.prototype[Symbol.iterator] = ArrayQueue.prototype.entries;

        ArrayQueue.prototype[Symbol.toStringTag] = "ArrayQueue";
    }

    /**
     *  @template T
     *  @constructor
     *  @param {T[]} arr
     */
    function PairIterator(arr)
    {
        this._elements = arr.slice();
        this._index = 0;
    }

    /**
     *  @template T
     */
    PairIterator.prototype = {
        constructor : PairIterator,

        next : function next()
        {
            var result = {
                /**  @type {[number, T]} */value : void 0,
                done : this._index >= this._elements.length
            };

            if(!result.done) {
                result.value = [this._index, this._elements[this._index]];
                ++this._index;
            }

            return result;
        }
    };

    if(isSymbolSupported()) {
        PairIterator.prototype[Symbol.iterator] = function ()
        {
            return this;
        };
    }

    return ArrayQueue;
})();

module.exports = {
    ArrayQueue : ArrayQueue
};
