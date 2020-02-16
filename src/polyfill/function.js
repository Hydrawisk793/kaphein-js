var isFunction = require("../type-trait").isFunction;

/* eslint-disable no-extend-native */

if(!Function.prototype.bind) {
    Function.prototype.bind = (function ()
    {
        var _slice = Array.prototype.slice;

        // reference 1 : https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind
        // reference 2 : https://www.reddit.com/r/javascript/comments/5ovl09/understanding_functionprototypebind_polyfill/
        return function bind(thisArg)
        {
            if(!isFunction(this)) {
                throw new TypeError("'this' must be a function.");
            }

            var args = _slice.call(arguments, 1);

            function T() {}

            var thisRef = this;
            function W()
            {
                return thisRef.apply(
                    (this instanceof T ? this : thisArg),
                    args.concat(_slice.call(arguments))
                );
            }

            if(this.prototype) {
                T.prototype = this.prototype;
            }
            W.prototype = new T();

            return W;
        };
    })();
}
