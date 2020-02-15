var isUndefinedOrNull = require("../type-trait").isUndefinedOrNull;
var isArray = require("../type-trait").isArray;
var relativelyEquals = require("../number-utils").relativelyEquals;

module.exports = (function ()
{
    var defaultDeepEqualityComparisionOption = {
        maximumDepth : Number.MAX_SAFE_INTEGER
    };

    /**
     *  @param {typeof defaultDeepEqualityComparisionOption} [option]
     */
    function deepEquals(l, r, option)
    {
        var context;
        var typeOfLhs
        var lhs, rhs;
        var lhsKeys, rhsKeys;
        var key;
        var keyIndex;
        var contextStack;
        var areEqual;
        var maximumDepth;

        option = (isUndefinedOrNull(option) ? defaultDeepEqualityComparisionOption : option);
        maximumDepth = option.maximumDepth;

        contextStack = [];
        contextStack.splice(
            contextStack.length - 1,
            0,
            {
                lhs : l,
                rhs : r,
                depth : 0
            }
        );

        for(areEqual = true; areEqual && contextStack.length > 0; ) {
            context = contextStack.splice(contextStack.length - 1, 1)[0];

            lhs = context.lhs;
            rhs = context.rhs;
            areEqual = lhs === rhs;

            if(!areEqual && context.depth < maximumDepth) {
                typeOfLhs = typeof lhs;

                if(typeOfLhs === typeof rhs) {
                    switch(typeOfLhs) {
                    case "undefined":
                        areEqual = true;
                    break;
                    case "number":
                        areEqual = relativelyEquals(lhs, rhs);
                    break;
                    case "object":
                        if(isArray(lhs) && isArray(rhs)) {
                            for(keyIndex = lhs.length, areEqual = lhs.length === rhs.length; areEqual && keyIndex > 0; ) {
                                --keyIndex;

                                contextStack.splice(
                                    context.length - 1,
                                    0,
                                    {
                                        lhs : lhs[keyIndex],
                                        rhs : rhs[keyIndex],
                                        depth : context.depth + 1
                                    }
                                );
                            }
                        }
                        else if(lhs instanceof RegExp && rhs instanceof RegExp) {
                            areEqual = lhs.source === rhs.source
                                && lhs.flags.split("").sort().join("") === rhs.flags.split("").sort().join("")
                            ;
                        }
                        else if(lhs instanceof Date && rhs instanceof Date) {
                            areEqual = lhs.getTime() === rhs.getTime();
                        }
                        else if(null !== lhs && null !== rhs) {
                            lhsKeys = Object.keys(lhs);
                            rhsKeys = Object.keys(rhs);

                            areEqual = lhsKeys.length === rhsKeys.length;
                            if(areEqual) {
                                lhsKeys.sort();
                                rhsKeys.sort();

                                for(keyIndex = lhsKeys.length; areEqual && keyIndex > 0; ) {
                                    --keyIndex;

                                    areEqual = lhsKeys[keyIndex] === rhsKeys[keyIndex];
                                }

                                for(keyIndex = lhsKeys.length; areEqual && keyIndex > 0; ) {
                                    --keyIndex;

                                    key = lhsKeys[keyIndex];
                                    contextStack.splice(
                                        context.length - 1,
                                        0,
                                        {
                                            lhs : lhs[key],
                                            rhs : rhs[key],
                                            depth : context.depth + 1
                                        }
                                    );
                                }
                            }
                        }
                    break;
                    default:

                    }
                }
            }
        }

        return areEqual;
    }

    function shallowEquals(lhs, rhs)
    {
        return deepEquals(lhs, rhs, { maximumDepth : 1 });
    }

    return {
        deepEquals : deepEquals,
        shallowEquals : shallowEquals
    };
})();
