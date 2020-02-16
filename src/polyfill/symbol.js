var PseudoSymbol = require("./pseudo-symbol").PseudoSymbol;
var StringValueIterator = require("./string-value-iterator").StringValueIterator;

/* eslint-disable no-extend-native, no-native-reassign, no-global-assign */

if(!Symbol) {
    Symbol = PseudoSymbol;
}

if(!Array.prototype[Symbol.iterator]) {
    Array.prototype[Symbol.iterator] = Array.prototype.values;
}

if(!String.prototype[Symbol.iterator]) {
    String.prototype[Symbol.iterator] = function ()
    {
        return new StringValueIterator(this);
    };
}
