/* eslint-disable no-extend-native */

/**
 *  @param {number} n
 */
function _isPositiveZero(n)
{
    return 1 / n === Infinity;
}

/**
 *  @param {number} n
 */
function _isNegativeZero(n)
{
    return 1 / n === -Infinity;
}

if(!Math.trunc) {
    Math.trunc = function (x)
    {
        return (
            Number.isNaN(x)
            ? NaN
            : (
                x < 0
                ? Math.ceil(x)
                : Math.floor(x)
            )
        );
    };
}

if(!Math.sign) {
    Math.sign = function (n)
    {
        var isNegZero, isPosZero;

        if(Number.isNaN(n)) {
            return NaN;
        }

        isNegZero = _isNegativeZero(n);
        if(isNegZero) {
            return -0;
        }

        isPosZero = _isPositiveZero(n);
        if(isPosZero) {
            return +0;
        }

        if(n < 0 && !isNegZero) {
            return -1;
        }

        if(n > 0 && !isPosZero) {
            return +1;
        }
    };
}

// if(!Math.clz32) {
//     Math.clz32 = function (x) {

//     };
// }

// if(!Math.imul) {
//     Math.imul = function (x, y) {

//     };
// }

if(!Math.expm1) {
    Math.expm1 = function (x)
    {
        return Math.exp(x) - 1;
    };
}

if(!Math.log1p) {
    Math.log1p = function (x)
    {
        return Math.log(1 + x);
    };
}

if(!Math.log10) {
    Math.log10 = function (x)
    {
        return Math.log(x) *  Math.LOG10E;
    };
}

if(!Math.log2) {
    Math.log2 = function (x)
    {
        return Math.log(x) *  Math.LOG2E;
    };
}

if(!Math.hypot) {
    Math.hypot = function ()
    {
        var i, len, n;
        var sum;

        for(sum = 0, i = 0, len = arguments.length; i < len; ++i) {
            n = Number(arguments[i]);

            if(Number.isNaN(n)) {
                return NaN;
            }

            sum += n * n;
        }

        return Math.sqrt(sum);
    };
}
