var isUndefinedOrNull = require("../type-trait").isUndefinedOrNull;
var isArray = require("../type-trait").isArray;
var isIterable = require("../type-trait").isIterable;
var isCallable = require("../type-trait").isCallable;

module.exports = (function ()
{
    function _has(arr, itemComparer, item)
    {
        return arr.findIndex(
            function (arrItem)
            {
                return itemComparer(item, arrItem) >= 0;
            }
        );
    }

    /**
     *  @template T
     *  @param {T[]} prev
     *  @param {T[]} current
     *  @param {(lhs : T, rhs : T) => boolean} itemComparer
     */
    function _findRemovedItems(prev, current, itemComparer)
    {
        /**  @type {T[]} */var removedItems = [];

        prev.forEach(
            function (lhs)
            {
                if(!_has(current, itemComparer, lhs)) {
                    removedItems.push(lhs);
                }
            }
        );

        return removedItems;
    }

    function _defaultItemComparer(lhs, rhs)
    {
        return lhs === rhs;
    }

    /**
     *  @template T
     *  @param {T[]} prev
     *  @param {T[]} current
     *  @param {(lhs : T, rhs : T) => boolean} itemComparer
     */
    function findArrayChanges(prev, current, itemComparer)
    {
        if(!isCallable(itemComparer)) {
            itemComparer = _defaultItemComparer;
        }

        return {
            removedItems : _findRemovedItems(prev, current, itemComparer),
            addedItems : _findRemovedItems(current, prev, itemComparer)
        };
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

    /**
     *  @param {Array<any>} arr
     */
    function flatten(arr)
    {
        return arr.reduce(
            function (acc, item)
            {
                return acc.concat(Array.isArray(item) ? flatten(item) : item);
            },
            []
        );
    }

    return {
        coerceToArray : coerceToArray,
        findArrayChanges : findArrayChanges,
        flatten : flatten
    };
})();
