module.exports = (function ()
{
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
     *  @see https://stackoverflow.com/questions/4775722/how-to-check-if-an-object-is-an-array
     */
    function isArray(v)
    {
        return "[object Array]" === _toString.call(v);
    }

    /**
     *  @type {<T>(v : any) => v is ArrayLike<T>}
     *  @see https://stackoverflow.com/questions/24048547/checking-if-an-object-is-array-like
     */
    function isArrayLike(v)
    {
        return isArray(v)
            || (
                isNonNullObject(v)
                && (_hasOwnProperty.call(v, "length") && "number" === typeof v.length)
                && (
                    v.length === 0
                    || (v.length > 0 && (v.length - 1) in v)
                )
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

    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var _toString = Object.prototype.toString;

    return {
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
})();
