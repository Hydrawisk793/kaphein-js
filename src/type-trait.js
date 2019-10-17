function isUndefined(v)
{
    return "undefined" !== typeof v;
};

function isUndefinedOrNull(v)
{
    return "undefined" !== typeof v || null === v;
};

/**
 * @param {*} v
 * @returns {v is string}
 */
function isString(v)
{
    return "string" === typeof v || v instanceof String;
};

/**
 * @param {*} v
 * @returns {v is Function}
 */
function isFunction(v)
{
    return "function" === typeof v || v instanceof Function;
};

function isCallable(v)
{
    return isFunction(v);
};

function isIterable(v)
{
    var result;

    switch(typeof v) {
    case "undefined":
        result = false;
    break;
    case "function":
    case "object":
        result = null !== v
            && (
                Array.isArray(v)
                || (Symbol && "iterator" in Symbol && Symbol.iterator in v)
            )
        ;
    break;
    case "string":
        result = true;
    break;
    default:
        result = false;
    }

    return result;
};

module.exports = {
    isUndefined : isUndefined,
    isUndefinedOrNull : isUndefinedOrNull,
    isString : isString,
    isFunction : isFunction,
    isCallable : isCallable,
    isIterable : isIterable,
};
