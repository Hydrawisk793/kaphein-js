var typeTrait = require("../utils/type-trait");
var isFunction = typeTrait.isFunction;

/* eslint-disable no-extend-native */

if(!Function.prototype.bind) {
    Function.prototype.bind = (function ()
    {
        var _slice = Array.prototype.slice;

        // reference 1 : https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind
        // reference 2 : https://www.reddit.com/r/javascript/comments/5ovl09/understanding_functionprototypebind_polyfill/
        return function (thisArg)
        {
            if(!isFunction(this)) {
                throw new TypeError("'this' must be a function.");
            }

            var args = _slice.call(arguments, 1);
            function TempFunction() {}
            var _this = this;
            function FunctionWrapper()
            {
                return _this.apply(
                    (this instanceof TempFunction ? this : thisArg),
                    args.concat(_slice.call(arguments))
                );
            }

            if(this.prototype) {
                TempFunction.prototype = this.prototype;
            }
            FunctionWrapper.prototype = new TempFunction();

            return FunctionWrapper;
        };
    })();
}
