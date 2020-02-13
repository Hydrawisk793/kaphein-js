var typeTrait = require("../type-trait");
var isUndefinedOrNull = typeTrait.isUndefinedOrNull;
var isArray = typeTrait.isArray;
var isIterable = typeTrait.isIterable;
var findArrayChanges = require("./find-array-changes").findArrayChanges;

/**
 *  @param {*[]} lhs
 *  @param {*[]} rhs
 */
function shallowEquals(lhs, rhs)
{
    var i;
    var result = lhs === rhs;

    if(!result) {
        result = Array.isArray(lhs) && Array.isArray(rhs)
            && lhs.length === rhs.length
        ;

        for(i = 0; result && i < lhs.length; ++i) {
            result = lhs[i] === rhs[i];
        }
    }

    return result;
}

/**
 *  @param {*} v
 *  @returns {*[]}
 */
function coerceToArray(v)
{
    var result;

    if(isUndefinedOrNull(v)) {
        result = [];
    }
    else if(isArray(v)) {
        result = v.slice();
    }
    else if(isIterable(v)) {
        result = Array.from(v);
    }
    else {
        result = Object.keys(v).map(
            function (key)
            {
                return [key, v[key]];
            }
        );
    }

    return result;
}

module.exports = {
    shallowEquals : shallowEquals,
    coerceToArray : coerceToArray,
    findArrayChanges : findArrayChanges,
};
