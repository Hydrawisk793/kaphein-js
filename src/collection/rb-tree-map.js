var isFunction = require("../type-trait").isFunction;
var isSymbolSupported = require("./is-symbol-supported").isSymbolSupported;
var RbTreeSet = require("./rb-tree-set").RbTreeSet;
var RbTreeSearchTarget = require("./rb-tree-search-target").RbTreeSearchTarget;

module.exports = (function ()
{
    /**
     *  @template T
     *  @typedef {import("./comparer").Comparer<T>} Comparer
     */

    /**
     *  @template T
     *  @param {T} lhs
     *  @param {T} rhs
     */
    function _defaultComparer(lhs, rhs)
    {
        return (lhs === rhs ? 0 : 1);
    }

    /**
     *  @template K, V
     *  @constructor
     *  @param {Iterable<[K,V]>} [iterable]
     *  @param {Comparer<K>} [comparer]
     */
    function RbTreeMap()
    {
        var comparer = isFunction(arguments[1]) ? arguments[1] : _defaultComparer;

        this._rbTreeSet = new RbTreeSet(
            arguments[0],
            /**
             *  @param {[K,V]} lhs
             *  @param {[K,V]} rhs
             */
            function (lhs, rhs)
            {
                return comparer(lhs[0], rhs[0]);
            }
        );
        this.size = 0;
    }

    RbTreeMap.prototype = {
        constructor : RbTreeMap,

        size : 0,

        getElementCount : function getElementCount()
        {
            return this._rbTreeSet.getElementCount();
        },

        /**
         *  @param {K} key
         *  @param {V} [defaultValue]
         *  @returns {V | undefined}
         */
        get : function get(key)
        {
            var result = void 0;

            var iter = this._rbTreeSet.find(
                [key, null],
                RbTreeSet.SearchTarget.equal
            );
            var endIter = this._rbTreeSet.end();
            var found = !iter.equals(endIter);
            if(found) {
                result = iter.dereference()[1];
            }
            else if(arguments.length >= 2) {
                var defaultValue = arguments[1];
                this.set(key, defaultValue);

                result = defaultValue;
            }

            return result;
        },

        /**
         *  @param {K} key
         *  @param {V} value
         *  @returns {RbTreeMap<K,V>}
         */
        set : function set(key, value)
        {
            var endIter = this._rbTreeSet.end();
            var iter = this._rbTreeSet.find(
                [key, null],
                RbTreeSet.SearchTarget.equal
            );
            if(iter.equals(endIter)) {
                this._rbTreeSet.add([key, value]);
                ++this.size;
            }
            else {
                iter.dereference()[1] = value;
            }

            return this;
        },

        /**
         *  @param {K} key
         *  @param {V} value
         */
        tryAdd : function tryAdd(key, value)
        {
            var endIter = this._rbTreeSet.end();
            var iter = this._rbTreeSet.find(
                [key, null],
                RbTreeSet.SearchTarget.equal
            );
            var result = iter.equals(endIter);
            if(result) {
                this._rbTreeSet.add([key, value]);
                ++this.size;
            }

            return result;
        },

        /**
         *  @param {K} key
         */
        has : function has(key)
        {
            return !this._rbTreeSet.find(
                [key, null],
                RbTreeSet.SearchTarget.equal
            ).euqls(this._rbTreeSet.end());
        },

        /**
         *  @param {K} key
         *  @param {RbTreeSearchTarget} searchTarget
         *  @returns {[K, V] | undefined}
         */
        findEntry : function findEntry(key, searchTarget)
        {
            var entry = this._rbTreeSet.findValue(key, searchTarget);

            return (entry ? entry.slice() : entry);
        },

        /**
         *  @param {K} key
         */
        findLessThan : function findLessThan(key)
        {
            return _adaptToOldFindFunction(this, key, RbTreeSearchTarget.less);
        },

        /**
         *  @param {K} key
         */
        findNotGreaterThan : function findNotGreaterThan(key)
        {
            return _adaptToOldFindFunction(this, key, RbTreeSearchTarget.lessOrEqual);
        },

        /**
         *  @param {K} key
         */
        findGreaterThan : function findGreaterThan(key)
        {
            return _adaptToOldFindFunction(this, key, RbTreeSearchTarget.greater);
        },


        /**
         *  @param {K} key
         */
        findNotLessThan : function findNotLessThan(key)
        {
            return _adaptToOldFindFunction(this, key, RbTreeSearchTarget.greaterOrEqual);
        },

        /**
         *  @returns {[K, V] | undefined}
         */
        getFirst : function getFirst()
        {
            if(this.getElementCount() > 0) {
                var endIter = this._rbTreeSet.end();
                var firstElemIter = this._rbTreeSet.begin();

                if(!firstElemIter.equals(endIter)) {
                    return firstElemIter.dereference().slice();
                }
            }
        },

        /**
         *  @returns {[K, V] | undefined}
         */
        getLast : function getLast()
        {
            if(this.getElementCount() > 0) {
                var endIter = this._rbTreeSet.end();
                var lastElemIter = this._rbTreeSet.end();
                lastElemIter.moveToPrevious();

                if(!lastElemIter.equals(endIter)) {
                    return _entryToResultObj(lastElemIter.dereference());
                }
            }
        },

        /**
         *  @param {Function} callback
         *  @param {*} [thisArg]
         */
        forEach : function forEach(callback)
        {
            var thisArg = arguments[1];
            for(
                var end = this._rbTreeSet.end(), iter = this._rbTreeSet.begin();
                !iter.equals(end);
                iter.moveToNext()
            ) {
                var pair = iter.dereference();
                callback.call(thisArg, pair[1], pair[0], this);
            }
        },

        /**
         *  @returns {PairIterator<K,V>}
         */
        entries : function entries()
        {
            return new PairIterator(this);
        },

        /**
         *  @returns {KeyIterator<K,V>}
         */
        keys : function keys()
        {
            return new KeyIterator(this);
        },

        /**
         *  @returns {ValueIterator<K,V>}
         */
        values : function values()
        {
            return new ValueIterator(this);
        },

        /**
         *  @param {K} key
         */
        remove : function remove(key)
        {
            var result = this._rbTreeSet["delete"]([key, null]);
            if(result) {
                --this.size;
            }

            return result;
        },

        clear : function clear()
        {
            this._rbTreeSet.clear();
            this.size = 0;
        },

        toString : function toString()
        {
            var str = "{";

            var pair = null;

            var iter = this.entries();
            var iR = iter.next();
            if(!iR.done) {
                pair = iR.value;
                str += _mapPairToString(pair[0], pair[1]);
            }

            for(iR = iter.next(); !iR.done; iR = iter.next()) {
                pair = iR.value;
                str += ",";
                str += _mapPairToString(pair[0], pair[1]);
            }

            str += "}";

            return str;
        }
    };

    /**
     *  @param {K} key
     */
    RbTreeMap.prototype["delete"] = RbTreeMap.prototype.remove;

    if(isSymbolSupported()) {
        /**
         *  @returns {PairIterator<K,V>}
         */
        RbTreeMap.prototype[Symbol.iterator] = function ()
        {
            return new PairIterator(this);
        };

        RbTreeMap.prototype[Symbol.toStringTag] = function ()
        {
            return "RbTreeMap";
        };
    }

    /**
     *  @template K, V
     *  @constructor
     *  @param {RbTreeMap<K,V>} RbTreeMap
     */
    function PairIterator(RbTreeMap)
    {
        this._iter = RbTreeMap._rbTreeSet.begin();
        this._end = RbTreeMap._rbTreeSet.end();
    }

    PairIterator.prototype = {
        constructor : PairIterator,

        /**
         *  @returns {IteratorReturnResult<[K,V]>}
         */
        next : function next()
        {
            var out = {
                done : this._iter.equals(this._end)
            };

            if(!out.done) {
                out.value = this._iter.dereference().slice();

                this._iter.moveToNext();
            }

            return out;
        }
    };

    /**
     *  @template K, V
     *  @constructor
     *  @param {RbTreeMap<K,V>} RbTreeMap
     */
    function KeyIterator(RbTreeMap)
    {
        this._iter = RbTreeMap._rbTreeSet.begin();
        this._end = RbTreeMap._rbTreeSet.end();
    }

    KeyIterator.prototype = {
        constructor : KeyIterator,

        /**
         *  @returns {IteratorReturnResult<K>}
         */
        next : function next()
        {
            var done = this._iter.equals(this._end);
            var out = {
                value : (!done ? this._iter.dereference()[0] : undefined),
                done : done
            };

            this._iter.moveToNext();

            return out;
        }
    };

    /**
     *  @template K, V
     *  @constructor
     *  @param {RbTreeMap<K, V>} RbTreeMap
     */
    function ValueIterator(RbTreeMap)
    {
        this._iter = RbTreeMap._rbTreeSet.begin();
        this._end = RbTreeMap._rbTreeSet.end();
    }

    ValueIterator.prototype = {
        constructor : ValueIterator,

        /**
         *  @returns {IteratorReturnResult<V>}
         */
        next : function next()
        {
            var out = {
                done : this._iter.equals(this._end)
            };

            if(!out.done) {
                out.value = this._iter.dereference()[1];

                this._iter.moveToNext();
            }

            return out;
        }
    };

    /**
     *  @template K, V
     *  @param {K} key
     *  @param {V} value
     */
    function _mapPairToString(key, value)
    {
        var str = key.toString();
        str += " => ";
        str += value;

        return str;
    }

    /**
     *  @template K, V
     *  @param {RbTreeMap<K, V>} thisRef
     *  @param {K} key
     *  @param {RbTreeSearchTarget} searchTarget
     */
    function _adaptToOldFindFunction(thisRef, key, searchTarget)
    {
        var entry = thisRef.findEntry(key, searchTarget);
        if(entry) {
            return _entryToResultObj(entry);
        }
    }

    /**
     *  @template K, V
     *  @param {[K, V]} entry
     *  @returns {{
            0 : K;
            1 : V;
            keiy : K;
            value : V;
        }}
     */
    function _entryToResultObj(entry)
    {
        var result = {
            key : entry[0],
            value : entry[1]
        };
        result[0] = entry[0];
        result[1] = entry[1];

        return result;
    }

    return {
        RbTreeMap : RbTreeMap
    };
})();