var isUndefined = require("../type-trait").isUndefined;
var isFunction = require("../type-trait").isFunction;
var isIterable = require("../type-trait").isIterable;
var isSymbolSupported = require("./is-symbol-supported").isSymbolSupported;

var ListQueue = (function ()
{
    /**
     *  @template T
     *  @constructor
     *  @param {T} element
     *  @param {ListNode<T>} next
     */
    function ListNode(element, next)
    {
        this.element = element;
        this.next = next;
    }

    ListNode.prototype.constructor = ListNode;

    /**
     *  @template T
     *  @constructor
     */
    function ListQueue()
    {
        /** @type {ListNode<T>} */this._head = null;
        /** @type {ListNode<T>} */this._tail = null;
        this._elemCount = 0;
    }

    /**
     *  @template T
     *  @param {Object} iterable
     *  @param {(value : T) => T} [mapFunc]
     *  @param {Object} [thisArg]
     */
    ListQueue.from = function from(iterable)
    {
        if(!isIterable(iterable)) {
            throw new TypeError("'iterable' must have the property 'Symbol.iterator'.");
        }

        var queue = new ListQueue();

        var mapFunc = arguments[1];
        if(isUndefined(mapFunc)) {
            for(
                var i = iterable[Symbol.iterator](), iP = i.next();
                !iP.done;
                iP = i.next()
            ) {
                queue.enqueue(iP.value);
            }
        }
        else {
            if(!isFunction(mapFunc)) {
                throw new TypeError("'mapFunc' must be a function.");
            }
            var thisArg = arguments[2];

            for(
                i = iterable[Symbol.iterator](), iP = i.next();
                !iP.done;
                iP = i.next()
            ) {
                queue.enqueue(mapFunc.call(thisArg, iP.value));
            }
        }

        return queue;
    };

    ListQueue.prototype = {
        constructor : ListQueue,

        getElementCount : function getElementCount()
        {
            return this._elemCount;
        },

        isEmpty : function isEmpty()
        {
            return null === this._head;
        },

        isFull : function isFull()
        {
            return this._elemCount >= Number.MAX_SAFE_INTEGER;
        },

        /**
         *  @returns {Iterator<T>}
         */
        values : function values()
        {
            return ({
                next : function next()
                {
                    var out = {
                        done : null === this._current
                    };

                    if(!out.done) {
                        out.value = this._current.element;
                        this._current = this._current.next;
                    }

                    return out;
                },

                _current : this._head
            });
        },

        peek : function peek()
        {
            if(this.isEmpty()) {
                throw new Error("The queue has no element.");
            }

            return this._head.element;
        },

        /**
         *  @param {T} e
         */
        enqueue : function enqueue(e)
        {
            var newNode;

            if(this.isFull()) {
                throw new Error("Cannot enqueue elements any more.");
            }

            newNode = new ListNode(e, null);

            if(!this.isEmpty()) {
                this._tail.next = newNode;
            }
            else {
                this._head = newNode;
            }
            this._tail = newNode;

            ++this._elemCount;

            return this;
        },

        dequeue : function dequeue()
        {
            if(this.isEmpty()) {
                throw new Error("The queue has no element.");
            }

            var element = null;
            if(this._head !== this._tail) {
                element = this._head.element;

                this._head = this._head.next;
            }
            else {
                element = this._tail.element;

                this._head = null;
                this._tail = null;
            }

            --this._elemCount;

            return element;
        },

        clear : function clear()
        {
            this._head = null;
            this._tail = null;
            this._elemCount = 0;
        },

        toString : function toString()
        {
            var str = '[';

            var iter = this[Symbol.iterator]();
            var pair = iter.next();
            if(!pair.done) {
                str += pair.value;
            }

            for(pair = iter.next(); !pair.done; pair = iter.next()) {
                str += ',';
                str += pair.value;
            }

            str += ']';

            return str;
        }
    };

    if(isSymbolSupported()) {
        ListQueue.prototype[Symbol.iterator] = function ()
        {
            return ({
                next : function next()
                {
                    var out = {
                        done : null === this._current
                    };

                    if(!out.done) {
                        out.value = this._current.element;
                        this._current = this._current.next;
                    }

                    return out;
                },

                _current : this._head
            });
        };
    }

    return ListQueue;
})();


module.exports = {
    ListQueue : ListQueue
};
