var isUndefined = require("../type-trait").isUndefined;
var isString = require("../type-trait").isString;
var isCallable = require("../type-trait").isCallable;
var isNonNullObject = require("../type-trait").isNonNullObject;
var ArrayKeyIterator = require("./array-key-iterator").ArrayKeyIterator;
var ArrayValueIterator = require("./array-value-iterator").ArrayValueIterator;
var ArrayEntryIterator = require("./array-entry-iterator").ArrayEntryIterator;

/* eslint-disable no-extend-native */

var _isArrayLike = (function ()
{
    var _hasOwnProperty = Object.prototype.hasOwnProperty;

    /**
     *  @see https://stackoverflow.com/questions/24048547/checking-if-an-object-is-array-like
     */
    return function (v)
    {
        return (
            Array.isArray(v)
            || (
                isNonNullObject(v)
                && (_hasOwnProperty.call(v, "length") && "number" === typeof v.length)
                && (
                    v.length === 0
                    || (v.length > 0 && (v.length - 1) in v)
                )
            )
        );
    };
})();

function _defaultTraitAssertionFunc(elem)
{
    return elem;
}

/**
 *  @param {number} i
 *  @param {number} n
 */
function _adjustNegativeIndex(i, n)
{
    return (i < 0 ? i + n : i);
}

/**
 *  @template T
 *  @param {ArrayLike<T>} arrayLike
 *  @param {number} index
 *  @returns {T}
 */
function _arrayLikeGetAt(arrayLike, index)
{
    return (
        isString(arrayLike)
        ? arrayLike.charAt(index)
        : arrayLike[index]
    );
}

/**
 *  @template T, I
 *  @param {T[]} arr
 *  @param {I} initialValue
 *  @returns {T|I}
 */
function _selectInitialValueForReduce(arr, initialValue)
{
    var selectedValue = initialValue;

    if(isUndefined(initialValue)) {
        if(arr.length > 0) {
            selectedValue = _arrayLikeGetAt(arr, 0);
        }
        else {
            throw new Error(
                "On an empty array, the 'initialValue' argument must be passed."
            );
        }
    }

    return selectedValue;
}

if(!Array.from) {
    Array.from = (function ()
    {
        /**
         *  @template T
         *  @param {T[]} arr
         *  @param {Function} traitAssertionFunc
         *  @param {*} pushBackMethodKey
         *  @param {ArrayLike<T>} arrayLike
         *  @param {Function} [mapFunction]
         *  @param {*} [thisArg]
         *  @return {T[]}
         */
        function _arrayFromFunctionBody(arr, traitAssertionFunc, pushBackMethodKey, arrayLike, mapFunction, thisArg)
        {
            var i, j, elem, iP;
            var mapFnExist = isCallable(mapFunction);

            traitAssertionFunc = (isCallable(traitAssertionFunc) ? traitAssertionFunc : _defaultTraitAssertionFunc);

            if(arrayLike[Symbol.iterator]) {
                for(
                    i = arrayLike[Symbol.iterator](), iP = i.next(), j = 0;
                    !iP.done;
                    iP = i.next(), ++j
                ) {
                    elem = traitAssertionFunc(iP.value);
                    if(mapFnExist) {
                        arr[pushBackMethodKey](mapFunction.call(thisArg, elem, j));
                    }
                    else {
                        arr[pushBackMethodKey](elem);
                    }
                }
            }
            else if(_isArrayLike(arrayLike)) {
                throw new Error("Not polyfilled yet...");
            }

            return arr;
        }

        return function from(arg)
        {
            return _arrayFromFunctionBody(
                [], null,
                "push", arg,
                arguments[1], arguments[2]
            );
        };
    })();
}

if(!Array.of) {
    Array.of = function ()
    {
        return Array.prototype.slice.call(arguments);
    };
}

if(!Array.isArray) {
    Array.isArray = (function ()
    {
        var toString = Object.prototype.toString;

        /**
         *  @returns {v is Array}
         *  @see https://stackoverflow.com/questions/4775722/how-to-check-if-an-object-is-an-array
         */
        return function isArray(v)
        {
            return "[object Array]" === toString.call(v);
        };
    })();
}

if(!Array.prototype.push) {
    Array.prototype.push = function push()
    {
        var i;
        var elem;

        for(i = 0; i < arguments.length; ++i) {
            elem = arguments[i];

            this.splice(this.length, 0, elem);
        }

        return this.length;
    };
}

Array.prototype.sort = (function ()
{
    var _originalSort = Array.prototype.sort;

    if(_originalSort) {
        var _allowsNonFunctionArg = (function ()
        {
            var result = false;

            try {
                [7, 9, 3].sort(null);

                result = true;
            }
            catch(e) {
                // Does nothing.
            }

            return result;
        }());

        if(_allowsNonFunctionArg) {
            return function sort(comparator)
            {
                var result;

                switch(typeof comparator) {
                case "undefined":
                    result = _originalSort.call(this);
                break;
                case "function":
                    result = _originalSort.call(this, comparator);
                break;
                default:
                    throw new TypeError("The 'comparator' must be a function or an undefined value.");
                }

                return result;
            };
        }
        else {
            return _originalSort;
        }
    }
    else {
        return function sort(/*comparator*/)
        {
            throw new Error("Not polyfilled yet...");
        };
    }
}());

if(!Array.prototype.copyWithin) {
    Array.prototype.copyWithin = function (target, start)
    {
        var len = this.length;
        start = _adjustNegativeIndex((isUndefined(start) ? 0 : start), len);
        var end = _adjustNegativeIndex((isUndefined(arguments[2]) ? len : arguments[2]), len);

        target = _adjustNegativeIndex(target, len);
        for(var i = target + (end - start), j = end; i > target && j > start; ) {
            --i;
            --j;

            if(i < len && (j in this)) {
                this[i] = this[j];
            }
        }

        return this;
    };
}

if(!Array.prototype.fill) {
    Array.prototype.fill = function (value)
    {
        var len = this.length;
        var start = _adjustNegativeIndex((isUndefined(arguments[1]) ? 0 : arguments[1]), len);
        var end = _adjustNegativeIndex((isUndefined(arguments[2]) ? len : arguments[2]), len);

        if(isString(this)) {
            if(len < 1) {
                return this;
            }
            else {
                throw new Error("Cannot modify readonly property '0'.");
            }
        }
        else {
            for(var i = start; i < end; ++i) {
                this[i] = value;
            }
        }

        return this;
    };
}

if(!Array.prototype.map) {
    Array.prototype.map = function (callback)
    {
        var thisArg = arguments[1];

        var result = [];
        for(var i = 0, len = this.length; i < len; ++i) {
            result.push(callback.call(thisArg, _arrayLikeGetAt(this, i), i, this));
        }

        return result;
    };
}

if(!Array.prototype.reduce) {
    Array.prototype.reduce = function (callback)
    {
        var acc = _selectInitialValueForReduce(this, arguments[1]);
        for(var i = 0, len = this.length; i < len ; ++i) {
            acc = callback(acc, _arrayLikeGetAt(this, i), i, this);
        }

        return acc;
    };
}

if(!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function (callback)
    {
        var acc = _selectInitialValueForReduce(this, arguments[1]);
        for(var i = this.length; i > 0; ) {
            --i;
            acc = callback(acc, _arrayLikeGetAt(this, i), i, this);
        }

        return acc;
    };
}

if(!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (callback)
    {
        for(
            var thisArg = arguments[1], foundIndex = -1, index = 0;
            foundIndex < 0 && index < this.length;
            ++index
        ) {
            if(callback.call(thisArg, this[index], index, this)) {
                foundIndex = index;
            }
        }

        return foundIndex;
    };
}

if(!Array.prototype.some) {
    Array.prototype.some = function (callback)
    {
        return this.findIndex(callback, arguments[1]) >= 0;
    };
}

if(!Array.prototype.every) {
    Array.prototype.every = function (callback)
    {
        var thisArg = arguments[1];

        for(var result = true, index = 0; result && index < this.length; ++index) {
            result = callback.call(thisArg, this[index], index, this);
        }

        return true;
    };
}

if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elem)
    {
        /**  @type {number} */var index = isUndefined(arguments[1]) ? 0 : arguments[1];
        var foundIndex = -1;

        for(; foundIndex < 0 && index < this.length; ++index) {
            if(this[index] === elem) {
                foundIndex = index;
            }
        }

        return foundIndex;
    };
}

if(!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (elem)
    {
        /**  @type {number} */var index = isUndefined(arguments[1]) ? this.length - 1 : arguments[1];
        var foundIndex = -1;

        for(; foundIndex < 0 && index >= 0; --index) {
            if(this[index] === elem) {
                foundIndex = index;
            }
        }

        return foundIndex;
    };
}

if(!Array.prototype.includes) {
    Array.prototype.includes = function (elem)
    {
        return this.indexOf(elem, arguments[1]) >= 0;
    };
}

if(!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback)
    {
        for(var i = 0, thisArg = arguments[1]; i < this.length; ++i) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

if(!Array.prototype.entries) {
    Array.prototype.entries = function ()
    {
        return new ArrayEntryIterator(this);
    };
}

if(!Array.prototype.keys) {
    Array.prototype.keys = function ()
    {
        return new ArrayKeyIterator(this);
    };
}

if(!Array.prototype.values) {
    Array.prototype.values = function ()
    {
        return new ArrayValueIterator(this);
    };
}
