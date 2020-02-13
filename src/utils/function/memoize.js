var isUndefinedOrNull = require("../type-trait").isUndefinedOrNull;
var isCallable = require("../type-trait").isCallable;
var deepEquals = require("../object").deepEquals;

var _slice = Array.prototype.slice;

function memoize(func, option)
{
    option = (!isUndefinedOrNull(option) ? option : {});
    var reuseResultReferenceIfPossible = (!("reuseResultReferenceIfPossible" in option) ? true : (!!option.reuseResultReferenceIfPossible));
    var equalComparer = (isCallable(option.equalComparer) ? option.equalComparer : deepEquals);
    var scope = {
        func : func,
        equalComparer : equalComparer,
        argsEqualComparer : (isCallable(option.argsEqualComparer) ? option.argsEqualComparer : equalComparer),
        resultEqualComparer : (isCallable(option.resultEqualComparer) ? option.resultEqualComparer : equalComparer),
        /**  @type {any[]} */lastArgs : null,
        lastResult : void 0,
        thisArg : option.thisArg,
    };

    return function ()
    {
        var newResult;
        /**  @type {any[]} */var args = _slice.call(arguments);

        if(!!option.alwaysEvaluate || !scope.argsEqualComparer(scope.lastArgs, args)) {
            newResult = scope.func.apply(scope.thisArg, args);

            if(!reuseResultReferenceIfPossible || !scope.resultEqualComparer(scope.lastResult, newResult)) {
                scope.lastResult = newResult;
            }

            scope.lastArgs = args;
        }

        return scope.lastResult;
    };
}

module.exports = {
    memoize : memoize,
};
