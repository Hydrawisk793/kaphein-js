var isUndefinedOrNull = require("../utils/type-trait").isUndefinedOrNull;
var isArrayLike = require("../utils/type-trait").isArrayLike;
var relativelyEquals = require("../utils/number").relativelyEquals;

var Vector4 = (function ()
{
    /**
     *  @constructor
     */
    function Vector4()
    {
        this.length = 4;
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;

        switch(arguments.length) {
        case 0:
        break;
        case 1:
            var src = arguments[0];

            if(_isVectorLike(src)) {
                this[0] = src[0];
                this[1] = src[1];
                this[2] = src[2];
                this[3] = src[3];
            }
            else if(!isUndefinedOrNull(src)) {
                if("x" in src && "number" === typeof src.x) {
                    this[0] = src.x;
                }

                if("y" in src && "number" === typeof src.y) {
                    this[1] = src.y;
                }

                if("z" in src && "number" === typeof src.z) {
                    this[2] = src.z;
                }

                if("w" in src && "number" === typeof src.w) {
                    this[3] = src.w;
                }
            }
        break;
        default:
            if("number" === typeof arguments[0]) {
                this[0] = arguments[0];
            }

            if("number" === typeof arguments[1]) {
                this[1] = arguments[1];
            }

            if("number" === typeof arguments[2]) {
                this[2] = arguments[2];
            }

            if("number" === typeof arguments[3]) {
                this[3] = arguments[3];
            }
        }
    }

    Vector4.zero = function ()
    {
        return new Vector4();
    };

    Vector4.one = function one()
    {
        return Vector4.fill(1);
    };

    /**
     *  @param {number} value
     */
    Vector4.fill = function fill(value)
    {
        return new Vector4(value, value, value, value);
    };

    Vector4.isCompatibleArrayLike = function isCompatibleArrayLike(v)
    {
        return _isVectorLike(v);
    };

    Vector4.prototype = {
        constructor : Vector4,

        length : 4,

        clone()
        {
            return new Vector4(this);
        },

        /**
         *  @param {number} x
         *  @param {number} y
         *  @param {number} z
         *  @param {number} w
         */
        setXyzw(x, y, z, w)
        {
            this[0] = x;
            this[1] = y;
            this[2] = z;
            this[3] = w;

            return this;
        },

        negate()
        {
            return new Vector4(this).negateAssign();
        },

        /**
         *  @param {ArrayLike<number>} other
         */
        dot(other)
        {
            return this[0] * other[0]
                + this[1] * other[1]
                + this[2] * other[2]
                + this[3] * other[3]
            ;
        },

        norm2Squared()
        {
            return this.dot(this);
        },

        norm2()
        {
            return Math.sqrt(this.norm2Squared());
        },

        normalize()
        {
            var norm2 = this.norm2();

            return this.scale((relativelyEquals(0.0, norm2) ? 0.0 : 1.0 / norm2));
        },

        /**
         *  @param {ArrayLike<number>} axis
         */
        project(axis)
        {
            /**  @type {Vector4} */var projected = null;

            var axisNorm2 = Vector4.prototype.norm2.call(axis);
            if(relativelyEquals(0.0, axisNorm2)) {
                projected = Vector4.zero();
            }
            else {
                projected = Vector4.prototype.scale.call(axis, this.dot(axis) / axisNorm2);
            }

            return projected;
        },

        /**
         *  @param {ArrayLike<number>} other
         */
        add(other)
        {
            return new Vector4(this).addAssign(other);
        },

        /**
         *  @param {ArrayLike<number>} other
         */
        subtract(other)
        {
            return new Vector4(this).subtractAssign(other);
        },

        /**
         *  @param {number} scalar
         */
        scale(scalar)
        {
            return new Vector4(this).scaleAssign(scalar);
        },

        /**
         *  @param {ArrayLike<number>} other
         */
        pointwiseMultiply(other)
        {
            return new Vector4(this).pointwiseMultiplyAssign(other);
        },

        isZero()
        {
            return relativelyEquals(0.0, this.norm2());
        },

        equals(other)
        {
            var result = this === other;
            if(!result) {
                result = _isVectorLike(other)
                    && relativelyEquals(this[0], other[0])
                    && relativelyEquals(this[1], other[1])
                    && relativelyEquals(this[2], other[2])
                    && relativelyEquals(this[3], other[3])
                ;
            }

            return result;
        },

        /**
         *  @param {ArrayLike<number>} other
         */
        assign(other)
        {
            this[0] = other[0];
            this[1] = other[1];
            this[2] = other[2];
            this[3] = other[3];

            return this;
        },

        negateAssign()
        {
            this[0] = -this[0];
            this[1] = -this[1];
            this[2] = -this[2];
            this[3] = -this[3];

            return this;
        },

        /**
         *  @param {ArrayLike<number>} other
         */
        addAssign(other)
        {
            this[0] += other[0];
            this[1] += other[1];
            this[2] += other[2];
            this[3] += other[3];

            return this;
        },

        /**
         *  @param {ArrayLike<number>} other
         */
        subtractAssign(other)
        {
            this[0] -= other[0];
            this[1] -= other[1];
            this[2] -= other[2];
            this[3] -= other[3];

            return this;
        },

        /**
         *  @param {number} scalar
         */
        scaleAssign(scalar)
        {
            this[0] *= scalar;
            this[1] *= scalar;
            this[2] *= scalar;
            this[3] *= scalar;

            return this;
        },

        /**
         *  @param {ArrayLike<number>} other
         */
        pointwiseMultiplyAssign(other)
        {
            this[0] *= other[0];
            this[1] *= other[1];
            this[2] *= other[2];
            this[3] *= other[3];

            return this;
        },

        toArray()
        {
            return Array.prototype.slice.call(this);
        },

        toString()
        {
            return "[" + Array.prototype.join.call(this, ",") + "]";
        },

        splice()
        {
            throw new Error("This function is just a dummy!");
        },
    };

    function _isArrayLike(v)
    {
        return (isArrayLike(v) && v.length >= 4);
    }

    function _isVectorLike(v)
    {
        return (v instanceof Vector4) || _isArrayLike(v);
    }

    return Vector4;
})();

module.exports = {
    Vector4 : Vector4,
};
