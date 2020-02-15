/**
 *  @constructor
 *  @param {string} str
 */
function StringValueIterator(str)
{
    this._str = str;
    this._i = 0;
}

/**
 *  @function
 *  @returns {IteratorReturnResult<string>}
 */
StringValueIterator.prototype.next = function ()
{
    var done = this._i >= this._str.length;
    var result = {
        value : (done ? void 0 : this._str.charAt(this._i)),
        done : done
    };

    if(!done) {
        ++this._i;
    }

    return result;
};

module.exports = {
    StringValueIterator : StringValueIterator
};
