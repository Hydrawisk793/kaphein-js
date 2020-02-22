var isUndefinedOrNull = require("../type-trait").isUndefinedOrNull;
var isArray = require("../type-trait").isArray;
var isIterable = require("../type-trait").isIterable;
var isSymbolSupported = require("./is-symbol-supported").isSymbolSupported;

module.exports = (function ()
{
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var _isSymbolSupported = isSymbolSupported();

    /**
     *  @constructor
     *  @param {Iterable<string>} [iterable]
     */
    function StringSet()
    {
        this.clear();

        var iterable = arguments[0];
        if(!isUndefinedOrNull(iterable)) {
            if(isArray(iterable)) {
                for(var i = 0; i < iterable.length; ++i) {
                    this.add(iterable[i]);
                }
            }
            else if(isIterable(iterable)) {
                var iter = iterable[Symbol.iterator]();
                for(var iterResult = iter.next(); !iterResult.done; iterResult = iter.next()) {
                    this.add(iterResult.value);
                }
            }
            else {
                throw new TypeError("The argument must be an iterable.");
            }
        }
    }

    StringSet.prototype = {
        constructor : StringSet,

        size : 0,

        /**
         *  @param {Function} callback
         *  @param {*} [thisArg]
         */
        forEach : function forEach(callback)
        {
            var thisArg = arguments[1];

            var values = Object.keys(this._map);
            for(var i = 0; i < values.length; ++i) {
                var value = values[i];
                callback.call(thisArg, value, value, this);
            }
        },

        entries : function entries()
        {
            /**  @type {IterableIterator<[string, string]>} */var iterator = {
                next : function next()
                {
                    var done = this._index >= this._values.length;
                    var result = {
                        value : void 0,
                        done : done
                    };

                    if(!done) {
                        var value = this._values[this._index];
                        result.value = [value, value]; 
                        ++this._index;
                    }

                    return result;
                }
            };
            iterator._values = Object.keys(this._map);
            iterator._index = 0;

            if(_isSymbolSupported) {
                iterator[Symbol.iterator] = function () {
                    return this;
                };
            }

            return iterator;
        },

        values : function values()
        {
            /**  @type {IterableIterator<string>} */var iterator = {
                next : function next()
                {
                    var done = this._index >= this._values.length;
                    var result = {
                        value : (done ? void 0 : this._values[this._index]),
                        done : done
                    };

                    if(!done) {
                        ++this._index;
                    }

                    return result;
                }
            };
            iterator._values = Object.keys(this._map);
            iterator._index = 0;

            if(_isSymbolSupported) {
                iterator[Symbol.iterator] = function () {
                    return this;
                };
            }

            return iterator;
        },

        /**
         *  @param {string} value
         *  @returns {boolean}
         */
        has : function has(value)
        {
            if("string" !== typeof value) {
                throw new TypeError("'value' must be a string.");
            }

            return _hasOwnProperty.call(this._map, value);
        },

        /**
         *  @param {string} value
         */
        add : function add(value)
        {
            if("string" !== typeof value) {
                throw new TypeError("Only strings can be added.");
            }

            var exists = this.has(value);

            if(!exists) {
                this._map[value] = value;
                ++this.size;
            }

            return this;
        },

        /**
         *  @param {string} value
         */
        "delete" : function (value)
        {
            var exists = this.has(value);

            if(exists) {
                delete this._map[value];
                --this.size;
            }

            return exists;
        },

        clear : function clear()
        {
            this._map = {};
            this.size = 0;
        }
    };

    StringSet.prototype.keys = StringSet.prototype.values;

    if(_isSymbolSupported) {
        StringSet.prototype[Symbol.iterator] = StringSet.prototype.values;

        StringSet.prototype[Symbol.toStringTag] = "StringSet";
    }

    return {
        StringSet : StringSet
    };
})();
