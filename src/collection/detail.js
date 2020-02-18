module.exports = (function ()
{
    /**
     *  @template T
     *  @param {T} lhs
     *  @param {T} rhs
     */
    function defaultEqualComparer(lhs, rhs)
    {
        return lhs === rhs;
    }

    return {
        defaultEqualComparer : defaultEqualComparer
    };
})();
