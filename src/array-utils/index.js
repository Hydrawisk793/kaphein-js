var isArray = require("../type-trait").isArray;
var isCallable = require("../type-trait").isCallable;

module.exports = (function ()
{
    function _has(arr, itemComparer, item)
    {
        return arr.findIndex(
            function (arrItem)
            {
                return itemComparer(item, arrItem);
            }
        ) >= 0;
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
     *  @param {(lhs : T, rhs : T) => boolean} [itemComparer]
     */
    function findArrayChanges(prev, current)
    {
        var itemComparer = arguments[2];
        if(!isCallable(itemComparer)) {
            itemComparer = _defaultItemComparer;
        }

        return {
            removedItems : _findRemovedItems(prev, current, itemComparer),
            addedItems : _findRemovedItems(current, prev, itemComparer)
        };
    }

    /**
     *  @template T
     *  @param {T | T[]} v
     *  @returns {T[]}
     */
    function coerceToArray(v)
    {
        return (isArray(v) ? v : [v]);
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
