var isNonNullObject = require("../type-trait").isNonNullObject;
var isFunction = require("../type-trait").isFunction;

module.exports = (function ()
{
    /**
     *  @template T
     *  @param {T} obj
     *  @param {
            (keyof T)[]
            | ((value : T[keyof T], key : keyof T, obj : T) => boolean)
            | Record<keyof T, any>
        } predicate
     */
    function pickKeys(obj, predicate)
    {
        /** @type {(keyof T)[]} */var finalKeys = Object.keys(obj);
        if(isFunction(predicate))
        {
            finalKeys = finalKeys
                .filter(function (key)
                {
                    return (0, predicate)(obj[key], key, obj);
                })
            ;
        }
        else if(Array.isArray(predicate))
        {
            finalKeys = finalKeys
                .filter(function (key)
                {
                    return predicate.includes(key);
                })
            ;
        }
        else if(isNonNullObject(predicate))
        {
            finalKeys = finalKeys
                .filter(function (key)
                {
                    return key in predicate;
                })
            ;
        }

        return finalKeys;
    }

    /**
     *  @template T
     *  @param {T} obj
     *  @param {
            (keyof T)[]
            | ((value : T[keyof T], key : keyof T, obj : T) => boolean)
            | Record<keyof T, any>
        } predicate
     */
    function pick(obj, predicate)
    {
        return pickKeys(obj, predicate)
            .reduce(function (acc, key)
            {
                acc[key] = obj[key];

                return acc;
            }, /** @type {Partial<T>} */({}))
        ;
    }

    /**
     *  @template T
     *  @param {T} obj
     *  @param {
            (keyof T)[]
            | ((value : T[keyof T], key : keyof T, obj : T) => boolean)
            | Record<keyof T, any>
        } predicate
     */
    function omitKeys(obj, predicate)
    {
        /** @type {(keyof T)[]} */var finalKeys = Object.keys(obj);
        if(isFunction(predicate))
        {
            finalKeys = finalKeys
                .filter(function (key)
                {
                    return !((0, predicate)(obj[key], key, obj));
                })
            ;
        }
        else if(Array.isArray(predicate))
        {
            finalKeys = finalKeys
                .filter(function (key)
                {
                    return !predicate.includes(key);
                })
            ;
        }
        else if(isNonNullObject(predicate))
        {
            finalKeys = finalKeys
                .filter(function (key)
                {
                    return !(key in predicate);
                })
            ;
        }

        return finalKeys;
    }

    /**
     *  @template T
     *  @param {T} obj
     *  @param {
            (keyof T)[]
            | ((value : T[keyof T], key : keyof T, obj : T) => boolean)
            | Record<keyof T, any>
        } predicate
     */
    function omit(obj, predicate)
    {
        return omitKeys(obj, predicate)
            .reduce(function (acc, key)
            {
                acc[key] = obj[key];

                return acc;
            }, /** @type {Partial<T>} */({}))
        ;
    }

    return {
        pickKeys : pickKeys,
        pick : pick,
        omitKeys : omitKeys,
        omit : omit
    };
})();
