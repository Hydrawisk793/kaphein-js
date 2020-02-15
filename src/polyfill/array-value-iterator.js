/**
 *  @template T
 *  @constructor
 *  @param {T[]} arr
 */
function ArrayValueIterator(arr)
{
    this._arr = arr.slice();
    this._index = 0;
}

ArrayValueIterator.prototype = {
    constructor : ArrayValueIterator,

    /**
     *  @returns {IteratorResult<T>}
     */
    next : function next()
    {
        var done = this._index >= this._arr.length;
        var result = {
            value : (done ? void 0 : this._arr[this._index]),
            done : done
        };

        if(!done) {
            ++this._index;
        }

        return result;
    }
};

module.exports = {
    ArrayValueIterator : ArrayValueIterator
};
