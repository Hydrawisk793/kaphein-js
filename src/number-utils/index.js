module.exports = (function ()
{
    /**
     *  @param {number} n
     */
    function isPositiveZero(n)
    {
        return 1 / n === Infinity;
    }

    /**
     *  @param {number} n
     */
    function isNegativeZero(n)
    {
        return 1 / n === -Infinity;
    }

    /**
     *  @param {number} l
     *  @param {number} r
     *  @param {number} [epsilon]
     */
    function relativelyEquals(l, r)
    {
        var epsilon = ("number" === typeof arguments[2] ? arguments[2] : 1e-9);

        var absLSubtractR = Math.abs(l - r);

        return absLSubtractR <= epsilon || absLSubtractR <= epsilon * Math.max(Math.abs(l), Math.abs(r));
    }

    /**
     *  @param {number} l
     *  @param {number} r
     *  @param {number} [epsilon]
     */
    function relativelyLessThan(l, r)
    {
        return !relativelyEquals(l, r, arguments[2]) && l < r;
    }

    /**
     *  @param {number} l
     *  @param {number} r
     *  @param {number} [epsilon]
     */
    function relativelyLessThanOrEqualTo(l, r)
    {
        return relativelyEquals(l, r, arguments[2]) || l < r;
    }

    /**
     *  @param {number} l
     *  @param {number} r
     *  @param {number} [epsilon]
     */
    function relativelyGreaterThan(l, r)
    {
        return !relativelyEquals(l, r, arguments[2]) && l > r;
    }

    /**
     *  @param {number} l
     *  @param {number} r
     *  @param {number} [epsilon]
     */
    function relativelyGreaterThanOrEqualTo(l, r)
    {
        return relativelyEquals(l, r, arguments[2]) || l > r;
    }

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
        isPositiveZero : isPositiveZero,
        isNegativeZero : isNegativeZero,

        relativelyEquals : relativelyEquals,
        relativelyLessThan : relativelyLessThan,
        relativelyLessThanOrEqualTo : relativelyLessThanOrEqualTo,
        relativelyGreaterThan : relativelyGreaterThan,
        relativelyGreaterThanOrEqualTo : relativelyGreaterThanOrEqualTo,

        findMinimumPowersOfTwoExponent : findMinimumPowersOfTwoExponent
    };
})();
