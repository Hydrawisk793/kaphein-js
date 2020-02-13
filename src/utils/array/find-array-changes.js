var isCallable = require("../type-trait").isCallable;

function _has(arr, itemComparer, item)
{
    return arr.findIndex((arrItem) => itemComparer(item, arrItem)) >= 0;
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
        addedItems : _findRemovedItems(current, prev, itemComparer),
    };
}

module.exports = {
    findArrayChanges : findArrayChanges,
};
