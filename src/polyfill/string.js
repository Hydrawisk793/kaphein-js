/* eslint-disable no-extend-native */

if(!String.prototype.repeat) {
    String.prototype.repeat = function (count)
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
    String.prototype.trim = function ()
    {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
}

if(!String.prototype.includes) {
    String.prototype.includes = function (elem)
    {
        return this.indexOf(elem, arguments[1]) >= 0;
    };
}

if(!String.prototype.startsWith) {
    String.prototype.startsWith = function (other)
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
    String.prototype.endsWith = function (other)
    {
        if(other instanceof RegExp) {
            throw new TypeError("The parameter must not be a RegExp object.");
        }

        var s = this.substr(0, (arguments.length > 1 ? arguments[1] : this.length));

        return s.substr(s.length - other.length, other.length) === other;
    };
}
