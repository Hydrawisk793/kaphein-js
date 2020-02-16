/**
 *  @template T
 *  @constructor
 *  @param {T[]} arr
 */
function ArrayEntryIterator(arr)
{
    this._arr = arr.slice();
    this._index = 0;
}

ArrayEntryIterator.prototype = {
    constructor : ArrayEntryIterator,

    /**
     *  @returns {IteratorResult<T>}
     */
    next : function next()
    {
        var done = this._index >= this._arr.length;
        var result = {
            value : (done ? void 0 : [this._index, this._arr[this._index]]),
            done : done
        };

        if(!done) {
            ++this._index;
        }

        return result;
    }
};

module.exports = {
    ArrayEntryIterator : ArrayEntryIterator
};
