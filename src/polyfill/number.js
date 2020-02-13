/* eslint-disable no-extend-native */

function _toInteger(v)
{
    var n = Number(v);

    if(isNaN(n)) {
        return +0;
    }

    if(
        n === 0
        || n === Infinity
        || n === -Infinity
    ) {
        return n;
    }

    return Math.sign(n) * Math.floor(Math.abs(n));
}

if(!Number.EPSILON) {
    Number.EPSILON = 2.2204460492503130808472633361816e-16;
}

if(!Number.MIN_SAFE_INTEGER) {
    Number.MIN_SAFE_INTEGER = -9007199254740991;
}

if(!Number.MAX_SAFE_INTEGER) {
    Number.MAX_SAFE_INTEGER = 9007199254740991;
}

if(!Number.isNaN) {
    Number.isNaN = isNaN
        || (
            function (/*v*/)
            {
                throw new Error("Not polyfilled yet...");
            }
        )
    ;
}

if(!Number.isFinite) {
    Number.isFinite = isFinite
        || (
            function (/*v*/)
            {
                throw new Error("Not polyfilled yet...");
            }
        )
    ;
}

if(!Number.isInteger) {
    Number.isInteger = function (n)
    {
        return Number.isFinite(n)
            && n === _toInteger(n)
        ;
    };
}

if(!Number.isSafeInteger) {
    Number.isSafeInteger = function (n)
    {
        return Number.isInteger(n)
            && Math.abs(n) <= Number.MAX_SAFE_INTEGER
        ;
    };
}

if(!Number.parseInt) {
    Number.parseInt = parseInt
        || (
            function ()
            {
                throw new Error("Not polyfilled yet...");
            }
        )
    ;
}

if(!Number.parseFloat) {
    Number.parseFloat = parseFloat
        || (
            function ()
            {
                throw new Error("Not polyfilled yet...");
            }
        )
    ;
}
