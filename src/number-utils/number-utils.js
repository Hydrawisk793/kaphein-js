module.exports = (function ()
{
    /**
     *  @param {number} v
     */
    function findMinimumPowersOfTwoExponent(v)
    {
        var exp;
        var max;
        for(exp = 1, max = 1 << exp; max < v; ++exp, max <<= 1);

        return exp;
    }

    return {
        findMinimumPowersOfTwoExponent : findMinimumPowersOfTwoExponent
    };
})();
