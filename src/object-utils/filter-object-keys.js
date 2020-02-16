var isUndefinedOrNull = require("../type-trait").isUndefinedOrNull;
var isCallable = require("../type-trait").isCallable;
var isArray = require("../type-trait").isArray;

module.exports = (function ()
{
    /**
     *  @param {*} obj
     *  @param {string[] | ((key : string) => boolean)} predicate
     *  @returns {Record<string, any>}
     */
    function filterObjectKeys(obj, predicate)
    {
        var i;
        var keys, key;
        var result;

        result = {};

        if(!isUndefinedOrNull(obj)) {
            if(isArray(predicate)) {
                for(i = 0; i < predicate.length; ++i) {
                    key = predicate[i];

                    if(key in obj) {
                        result[key] = obj[key];
                    }
                }
            }
            else if(isCallable(predicate)) {
                for(keys = Object.keys(obj), i = 0; i < keys.length; ++i) {
                    key = keys[i];

                    if(predicate(key)) {
                        result[key] = obj[key];
                    }
                }
            }
            else {
                throw new TypeError("'predicate' must be an array of string or a function.");
            }
        }

        return result;
    }

    return {
        filterObjectKeys : filterObjectKeys
    };
})();
