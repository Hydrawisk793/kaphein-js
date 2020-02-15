/**
 *  @template T
 *  @constructor
 *  @param {T[]} arr
 */
function ArrayKeyIterator(arr)
{
    this._arr = arr.slice();
    this._index = 0;
}

ArrayKeyIterator.prototype = {
    constructor : ArrayKeyIterator,

    /**
     *  @returns {IteratorResult<T>}
     */
    next : function next()
    {
        var done = this._index >= this._arr.length;
        var result = {
            value : (done ? void 0 : this._index),
            done : done
        };

        if(!done) {
            ++this._index;
        }

        return result;
    }
};

module.exports = {
    ArrayKeyIterator : ArrayKeyIterator
};
