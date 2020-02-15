var typeTrait = require("../type-trait");
var isUndefined = typeTrait.isUndefined;
var isUndefinedOrNull = typeTrait.isUndefinedOrNull;

/* eslint-disable no-extend-native */

Object.keys = (function ()
{
    var _originalKeys = Object.keys;

    var _isOriginalEs6Spec = (function ()
    {
        if(_originalKeys) {
            try {
                _originalKeys("");

                return true;
            }
            catch(e) {
                return false;
            }
        }

        return false;
    }());

    var _missingKeys = [
        "constructor",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "toLocaleString",
        "toString",
        "valueOf"
    ];

    var _canNotEnumerateToString = !Object.prototype.propertyIsEnumerable.call(({ toString : null }), "toString");

    function _throwError()
    {
        throw new Error("At least one non-null object argument must be passed.");
    }

    var _hasOwnPropertyMethod = Object.prototype.hasOwnProperty;

    function _getKeysFromObject(o)
    {
        if(isUndefinedOrNull(o)) {
            _throwError();
        }

        var keys = [];
        var key;
        for(key in o) {
            if(_hasOwnPropertyMethod.call(o, key)) {
                keys.push(key);
            }
        }

        if(_canNotEnumerateToString) {
            for(key in _missingKeys) {
                if(!_hasOwnPropertyMethod.call(o, key)) {
                    keys.push(key);
                }
            }
        }

        return keys;
    }

    function _getKeysFromString(o)
    {
        var keys = [];
        var i;

        for(i = 0; i < o.length; ++i) {
            keys.push("" + i);
        }

        return keys;
    }

    function _pseudoKeys(o, getKeysFromObjectFunction)
    {
        var result;

        switch(typeof o) {
        case "undefined":
            _throwError();
        break;
        case "boolean":
        case "number":
        case "symbol":
            result = [];
        break;
        case "string":
            result = _getKeysFromString(o);
        break;
        default:
            result = getKeysFromObjectFunction(o);
        }

        return result;
    }

    if(_originalKeys) {
        if(_isOriginalEs6Spec) {
            return _originalKeys;
        }
        else {
            return function keys(o)
            {
                return _pseudoKeys(o, _originalKeys);
            };
        }
    }
    else {
        return function keys(o)
        {
            return _pseudoKeys(o, _getKeysFromObject);
        };
    }
}());

if(!Object.create) {
    Object.create = function create(proto)
    {
        if(null === proto) {
            throw new Error("This environment doesn't support null argument for 'proto' parameter.");
        }

        if(isUndefined(proto)) {
            throw new TypeError("The parameter 'proto' must be an object.");
        }

        function Derived() {}
        Derived.prototype = proto;

        var newObject = new Derived();
        newObject.constructor = proto.constructor;
        if(arguments.length > 1) {
            Object.defineProperties(Derived.prototype, arguments[1]);
        }

        return newObject;
    }
}

if(!Object.getPrototypeOf) {
    Object.getPrototypeOf = function getPrototypeOf(o)
    {
        if(isUndefinedOrNull(o)) {
            throw new TypeError("The parameter cannot be undefined or null.");
        }

        if(!(o.__proto__)) {
            throw new Error("This environment doesn't support retrieving prototype of an object and the passed object also does't have '__proto__' property.");
        }

        return o.__proto__;
    };
}

if(!Object.assign) {
    Object.assign = (function ()
    {
        var _hasOwnProperty = Object.prototype.hasOwnProperty;

        return function assign(target, src)
        {
            var srcKey, i;
            var argCount = arguments.length;

            if(argCount < 1 || isUndefinedOrNull(target)) {
                throw new Error("The target cannot be null or undefined.");
            }

            for(i = 1; i < argCount; ++i) {
                src = arguments[i];

                if(!isUndefinedOrNull(src)) {
                    for(srcKey in src) {
                        if(_hasOwnProperty.call(src, srcKey)) {
                            target[srcKey] = src[srcKey];
                        }
                    }
                }
            }

            return target;
        };
    })();
}
