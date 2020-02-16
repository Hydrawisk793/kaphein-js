var isUndefined = require("../type-trait").isUndefined;

module.exports = (function ()
{
    var _polyfillPropNamePrefix = "kaphein_";

    /**
     *  @param {*} arg
     *  @returns {string}
     */
    function _createKey(arg)
    {
        var key = "";

        switch(typeof arg) {
        case "string":
            key = arg;
        break;
        case "object":
            key = (null === arg ? "null" : arg.toString());
        break;
        case "undefined":
            key = "";
        break;
        default:
            key = arg.toString();
        }

        return key;
    }

    /**
     *  @constructor
     */
    function PseudoSymbolRegistry()
    {
        this._registry = [];
    }

    /**
     *  @param {string} key
     *  @returns {boolean}
     */
    PseudoSymbolRegistry.prototype.hasSymbol = function (key)
    {
        return this._findPairIndexByKey(key) >= 0;
    };

    /**
     *  @param {PseudoSymbol} symbol
     *  @returns {string|undefined}
     */
    PseudoSymbolRegistry.prototype.findKeyBySymbol = function (symbol)
    {
        var index = this._registry.findIndex(
            function (pair)
            {
                //Es6 스펙 19.4.2.5절에 따라 === 사용.
                return pair.value === symbol
                    //&& pair.key === symbol._key
                ;
            }
        );

        if(index >= 0) {
            return this._registry[index].key;
        }
    };

    /**
     *  @param {string} key
     *  @returns {PseudoSymbol}
     */
    PseudoSymbolRegistry.prototype.getOrCreateSymbolByKey = function (key)
    {
        var index = this._findPairIndexByKey(key);
        if(index < 0) {
            index = this._registry.length;
            this._registry.push({key : key, value : PseudoSymbol(key)});
        }

        return this._registry[index].value;
    };

    /**
     *  @function
     *  @param {string} key
     *  @returns {Number}
     */
    PseudoSymbolRegistry.prototype._findPairIndexByKey = function (key)
    {
        return this._registry.findIndex(
            function (pair)
            {
                return pair.key === key;
            }
        );
    };

    var _globalIdCounter = 0;

    function PseudoSymbolValue()
    {
        this._key = _createKey(arguments[0]);

        this._id = ++_globalIdCounter;

        // A non-standard behaviour that tests if the id sequencer overflow has occured.
        // This is necessary because the non-standard 'id' of polyfilled symbol must be distinct.
        if(this._id === 0) {
            throw new Error("The Symbol polyfill cannot instantiate additional distinct symbols...");
        }
    }

    /**
     *  Creates and returns a new symbol using a optional parameter 'description' as a key.
     *  There is no way to force not using the new operator because the 'new.target' virtual property does not exist in ES3 environment.
     *  references:
     *  - http://ecma-international.org/ecma-262/5.1/#sec-9.12
     *  - https://www.keithcirkel.co.uk/metaprogramming-in-es6-symbols/
     *
     *  @constructor
     *  @param {string} [description]
     *  @returns {PseudoSymbolValue}
     */
    function PseudoSymbol()
    {
        //This code can't be a complete alternative of 'new.target' proposed in Es6 spec
        //because this can cause some problems
        //when Object.create(PseudoSymbol.prototype) is used to inherit 'PseudoSymbol.prototype'.
        //if((this instanceof PseudoSymbol)) {
        //    throw new TypeError("'Symbol' cannot be instantiated by the new operator.");
        //}

        var arg = arguments[0];

        //It works because it's a polyfill which is an object...
        if(arg instanceof PseudoSymbol) {
            throw new TypeError("Cannot convert symbol value to string.");
        }

        var newSymbol = new PseudoSymbolValue(arg);

        return newSymbol;
    }
    PseudoSymbol.prototype = PseudoSymbolValue.prototype;
    PseudoSymbol.prototype.constructor = PseudoSymbol;

    /**
     *  @private
     *  @readonly
     */
    PseudoSymbol._symbolKeyPattern = new RegExp("^" + PseudoSymbol._symbolKeyPrefix + "[0-9]+_");

    /**
     *  @private
     *  @readonly
     */
    PseudoSymbol._symbolKeyPrefix = _polyfillPropNamePrefix + "Symbol";

    /**
     *  @private
     *  @readonly
     */
    PseudoSymbol._globalRegistry = new PseudoSymbolRegistry();

    (function ()
    {
        var i, knownSymbolKey;
        var _knownSymbolKeys = [
            "iterator",
            "match",
            "replace",
            "search",
            "split",
            "hasInstance",
            "isConcatSpreadable",
            "unscopables",
            "species",
            "toPrimitive",
            "toStringTag"
        ];

        for(i = _knownSymbolKeys.length; i > 0; ) {
            --i;
            knownSymbolKey = _knownSymbolKeys[i];

            PseudoSymbol[knownSymbolKey] = PseudoSymbol(knownSymbolKey);
        }
    })();

    /**
     *  @param {string} key
     *  @returns {PseudoSymbol}
     */
    PseudoSymbol["for"] = function (key)
    {
        return PseudoSymbol._globalRegistry.getOrCreateSymbolByKey(
            _createKey((!isUndefined(key) ? key : "undefined"))
        );
    };

    /**
     *  @param {PseudoSymbol} symbol
     *  @returns {String|undefined}
     */
    PseudoSymbol.keyFor = function (symbol)
    {
        return PseudoSymbol._globalRegistry.findKeyBySymbol(symbol);
    };

    /**
     *  A non-standard function to get 'SymbolDescriptiveString'.
     *
     *  @returns {string}
     */
    PseudoSymbol.prototype.toSymbolDescriptiveString = function ()
    {
        return "Symbol(" + this._key + ")";
    };

    /**
     *  Outputs a 'non-standard' string for distinguishing each symbol instances.
     *  To get a 'SymbolDescriptiveString' described in the standard,
     *  use a non-standard function 'PseudoSymbol.prototype.toSymbolDescriptiveString' instead.
     *
     *  @returns {string}
     *  @see PseudoSymbol.prototype.toSymbolDescriptiveString
     */
    PseudoSymbol.prototype.toString = function ()
    {
        return PseudoSymbol._symbolKeyPrefix + this._id + "_" + this.toSymbolDescriptiveString();
    };

    /**
     *  @returns {PseudoSymbol}
     */
    PseudoSymbol.prototype.valueOf = function ()
    {
        return this;
    };

    /**
    *  @param {string} hint
    *  @returns {PseudoSymbol}
    */
    // eslint-disable-next-line no-unused-vars
    PseudoSymbol.prototype[PseudoSymbol.toPrimitive] = function (hint)
    {
        return this.valueOf();
    };

    /**
     *  @returns {SymbolConstructor|(typeof PseudoSymbol)}
     */
    function getSymbolConstructor()
    {
        return (Symbol ? Symbol : PseudoSymbol);
    }

    return {
        PseudoSymbol : PseudoSymbol,
        getSymbolConstructor : getSymbolConstructor
    };
})();
