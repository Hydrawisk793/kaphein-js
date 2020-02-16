/* eslint-disable no-extend-native */

if(!String.prototype.repeat) {
    String.prototype.repeat = function repeat(count)
    {
        var str;
        var i;

        count = Math.trunc(count);
        if(count < 0 || Infinity === count) {
            throw new RangeError("The parameter 'count' must be greater than or equal to zero and less than positive infinity.");
        }

        for(str = "", i = 0; i < count; ++i) {
            str += this;
        }

        return str;
    };
}

if(!String.prototype.trim) {
    /**
     *  @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/trim
     */
    String.prototype.trim = function trim()
    {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
}

if(!String.prototype.includes) {
    String.prototype.includes = function includes(elem)
    {
        return this.indexOf(elem, arguments[1]) >= 0;
    };
}

if(!String.prototype.startsWith) {
    String.prototype.startsWith = function startsWith(other)
    {
        if(other instanceof RegExp) {
            throw new TypeError("The parameter must not be a RegExp object.");
        }

        return this.substr(
            (arguments.length > 1 ? arguments[1] : 0),
            other.length
        ) === other;
    };
}

if(!String.prototype.endsWith) {
    String.prototype.endsWith = function endsWith(other)
    {
        if(other instanceof RegExp) {
            throw new TypeError("The parameter must not be a RegExp object.");
        }

        var s = this.substr(0, (arguments.length > 1 ? arguments[1] : this.length));

        return s.substr(s.length - other.length, other.length) === other;
    };
}

if(!String.prototype.padStart) {
    String.prototype.padStart = (function ()
    {
        /**
         *  @this {string}
         */
        function padStart(len)
        {
            var ch = "string" === typeof ch ? ch : " ";
            if(ch.length > 1) {
                throw new Error("Not implemeted yet.");
            }

            var str = this;
            if(len > this.length) {
                var padLen = len - str.length;
                var prefix = "";
                for(var i = 0; i < padLen; ++i) {
                    prefix += ch;
                }

                str = prefix + str;
            }

            return str;
        }

        return padStart;
    })();
}
