/**
 *  @template T
 *  @param {T} lhs
 *  @param {T} rhs
 */
function defaultEqualComparer(lhs, rhs)
{
    return lhs === rhs;
}

module.exports = {
    defaultEqualComparer : defaultEqualComparer,
};
