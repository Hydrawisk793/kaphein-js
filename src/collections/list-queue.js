var typeTrait = require("../type-trait");
var isUndefined = typeTrait.isUndefined;
var isFunction = typeTrait.isFunction;
var isIterable = typeTrait.isIterable;

/**
 *  @template T
 *  @constructor
 *  @param {T} element
 *  @param {_Node<T>} next
 */
function _Node(element, next)
{
    this.element = element;
    this.next = next;
};

/**
 *  @template T
 *  @constructor
 */
function ListQueue()
{
    this._head = null;
    this._tail = null;
    this._elemCount = 0;
};

/**
 *  @param {Object} iterable
 *  @param {Function} [mapFunc]
 *  @param {Object} [thisArg]
 *  @returns {ListQueue<T>}
 */
ListQueue.from = function (iterable)
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
            var i = iterable[Symbol.iterator](), iP = i.next();
            !iP.done;
            iP = i.next()
        ) {
            queue.enqueue(mapFunc.call(thisArg, iP.value));
        }
    }

    return queue;
};

/**
 *  @returns {number}
 */
ListQueue.prototype.getElementCount = function ()
{
    return this._elemCount;
};

/**
 *  @returns {boolean}
 */
ListQueue.prototype.isEmpty = function ()
{
    return null === this._head;
};

/**
 *  @returns {boolean}
 */
ListQueue.prototype.isFull = function ()
{
    return this._elemCount >= Number.MAX_SAFE_INTEGER;
};

/**
 *  @returns {Iterator<T>}
 */
ListQueue.prototype.values = function ()
{
    return ({
        next : function () {
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

ListQueue.prototype[Symbol.iterator] = function ()
{
    return ({
        next : function () {
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

/**
 *  @returns {T}
 */
ListQueue.prototype.peek = function ()
{
    if(this.isEmpty()) {
        throw new Error("The queue has no element.");
    }

    return this._head.element;
};

/**
 *  @param {T} e
 *  @returns {ListQueue<T>}
 */
ListQueue.prototype.enqueue = function (e)
{
    if(this.isFull()) {
        throw new Error("Cannot enqueue elements any more.");
    }

    var newNode = new _Node(e, null);

    if(!this.isEmpty()) {
        this._tail.next = newNode;
    }
    else {
        this._head = newNode;
    }
    this._tail = newNode;

    ++this._elemCount;

    return this;
};

/**
 *  @returns {T}
 */
ListQueue.prototype.dequeue = function ()
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
};

ListQueue.prototype.clear = function ()
{
    this._head = null;
    this._tail = null;
    this._elemCount = 0;
};

/**
 *  @returns {string}
 */
ListQueue.prototype.toString = function ()
{
    var str = '[';

    var iter = this[Symbol.iterator]();
    var pair = iter.next();
    if(!pair.done) {
        str += pair.value;
    }

    for(pair = iter.next(); !pair.done; pair = iter.next()) {
        str += ", ";
        str += pair.value;
    }

    str += ']';

    return str;
};

module.exports = {
    ListQueue : ListQueue,
};
