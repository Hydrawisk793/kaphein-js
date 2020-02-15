/**
 *  @param {*} v
 *  @returns {v is undefined}
 */
function isUndefined(v)
{
    return "undefined" === typeof v;
}

/**
 *  @param {*} v
 *  @returns {v is undefined | null}
 */
function isUndefinedOrNull(v)
{
    return "undefined" === typeof v || null === v;
}

/**
 *  @param {*} v
 *  @returns {v is Object}
 */
function isNonNullObject(v)
{
    return "object" === typeof v && null !== v;
}

/**
 *  @param {*} v
 *  @returns {v is Number}
 */
function isNumber(v)
{
    return "number" === typeof v || v instanceof Number;
}

/**
 *  @param {*} v
 *  @returns {v is string}
 */
function isString(v)
{
    return "string" === typeof v || v instanceof String;
}

/**
 *  @param {*} v
 *  @returns {v is Array}
 */
function isArray(v)
{
    return Array.isArray(v);
}

/**
 *  @type {<T>(v : any) => v is ArrayLike<T>}
 */
function isArrayLike(v)
{
    return Array.isArray(v)
        || (
            ("length" in v && "number" === typeof v.length && v.length >= 0)
            && ((v.length -1) in v)
        )
    ;
}

/**
 *  @param {*} v
 *  @returns {v is Function}
 */
function isFunction(v)
{
    return "function" === typeof v || v instanceof Function;
}

/**
 *  @param {*} v
 *  @returns {v is CallableFunction}
 */
function isCallable(v)
{
    return isFunction(v)
        || (!isUndefinedOrNull(v) && "function" === typeof v.call)
    ;
}

/**
 *  @type {<T>(v : any) => v is Iterable<T>}
 */
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
                isArray(v)
                || (("function" === typeof Symbol && "iterator" in Symbol) && Symbol.iterator in v)
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
}

/**
 *  @param {*} v
 *  @returns {v is PromiseLike<any>}
 */
function isPromiseLike(v)
{
    return isNonNullObject(v)
        && ("then" in v)
        && isFunction(v.then)
    ;
}

module.exports = {
    isUndefined : isUndefined,
    isUndefinedOrNull : isUndefinedOrNull,
    isNonNullObject : isNonNullObject,
    isNumber : isNumber,
    isString : isString,
    isArray : isArray,
    isArrayLike : isArrayLike,
    isFunction : isFunction,
    isCallable : isCallable,
    isIterable : isIterable,
    isPromiseLike : isPromiseLike
};
