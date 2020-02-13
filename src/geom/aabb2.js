var relativelyLessThan = require("../utils/number").relativelyLessThan;
var Vector2 = require("./vector2").Vector2;

var Aabb2 = (function ()
{
    /**
     *  @readonly
     *  @enum {number}
     */
    var Direction = {
        LEFT : 0,
        RIGHT : 1,
        TOP : 2,
        BOTTOM : 3,
        LEFT_TOP : 4,
        RIGHT_TOP : 5,
        LEFT_BOTTOM : 6,
        RIGHT_BOTTOM : 7,
    };

    /**
     *  @constructor
     */
    function Aabb2()
    {
        /** @type {Vector2} */this._min = null;
        /** @type {Vector2} */this._max = null;

        switch(arguments.length) {
        case 0:
            this._min = Vector2.zero();
            this._max = Vector2.zero();
        break;
        case 1:
            if(arguments[0] instanceof Aabb2) {
                this._min = new Vector2(arguments[0]._min);
                this._max = new Vector2(arguments[0]._max);
            }
            else {
                throw new TypeError("");
            }
        break;
        case 2:
            if(Vector2.isCompatibleArrayLike(arguments[0]) && Vector2.isCompatibleArrayLike(arguments[1])) {
                this._min = new Vector2(arguments[0]);
                this._max = new Vector2(arguments[1]);
            }
            else {
                throw new TypeError("");
            }
        break;
        default:
            throw new Error("");
        }

        if(
            this._max[0] < this._min[0]
            || this._max[1] < this._min[1]
        ) {
            throw new RangeError("'max' must be greater than or equal to 'min'.");
        }
    }

    Aabb2.Direction = Direction;

    /**
     *  @param {Vector2} min
     *  @param {Vector2} max
     */
    Aabb2.fromMinimumAndMaximum = function (min, max)
    {
        return new Aabb2(min, max);
    };

    /**
     *  @param {Vector2} min
     *  @param {Vector2} size
     */
    Aabb2.fromMinimumAndSize = function (min, size)
    {
        return new Aabb2(min, min.add(size));
    };

    /**
     *  @param {Vector2} center
     *  @param {Vector2} extent
     */
    Aabb2.fromCenterAndExtent = function (center, extent)
    {
        return new Aabb2(center.subtract(extent), center.add(extent));
    };

    /**
     *  @param {...Aabb2[]} rects
     */
    Aabb2.merge = function ()
    {
        /** @type {Aabb2} */var result = null;
        /** @type {Aabb2} */var first = null;

        switch(arguments.length) {
        case 0:
            throw new TypeError("");
        // break;
        default:
            first = arguments[0];

            if(!(first instanceof Aabb2)) {
                throw new TypeError("");
            }

            result = (
                arguments.length < 2
                ? first
                : Aabb2.prototype.merge.apply(first, Array.prototype.slice.call(arguments, 1))
            );
        }

        return result;
    };

    Aabb2.prototype = {
        constructor : Aabb2,

        getLeft()
        {
            return this._min[0];
        },

        getTop()
        {
            return this._min[1];
        },

        getLeftTop()
        {
            return new Vector2(this._min);
        },

        getMinimum()
        {
            return new Vector2(this._min);
        },

        getRight()
        {
            return this._max[0];
        },

        getBottom()
        {
            return this._max[1];
        },

        getRightBottom()
        {
            return new Vector2(this._max);
        },

        getMaximum()
        {
            return new Vector2(this._max);
        },

        getCenter()
        {
            return this._min.add(this.getExtent());
        },

        getExtent()
        {
            return this.getSize().scaleAssign(0.5);
        },

        getLeftRight()
        {
            return this.getAxisRange(0);
        },

        getTopBottom()
        {
            return this.getAxisRange(1);
        },

        /**
         *  @param {number} index
         */
        getAxisRange(index)
        {
            /** @type {Vector2} */var range = null;

            switch(index) {
            case 0:
                range = new Vector2(this._min[0], this._max[0]);
            break;
            case 1:
                range = new Vector2(this._min[1], this._max[1]);
            break;
            default:
                throw new RangeError("'index' must be in range [0, 1].");
            }

            return range;
        },

        getExtremum(index)
        {
            /** @type {Vector2} */var range = null;

            switch(index) {
            case 0:
                range = this.getMinimum();
            break;
            case 1:
                range = this.getMaximum();
            break;
            default:
                throw new RangeError("'index' must be in range [0, 1].");
            }

            return range;
        },

        getCorner(index)
        {
            /** @type {Vector2} */var corner = null;

            switch(index) {
            case 0:
                corner = this.getMinimum();
            break;
            case 1:
                corner = new Vector2(this._max[0], this._min[1]);
            break;
            case 2:
                corner = new Vector2(this._min[0], this._max[1]);
            break;
            case 3:
                corner = this.getMaximum();
            break;
            default:
                throw new RangeError("'index' must be in range [0, 3].");
            }

            return corner;
        },

        getWidth()
        {
            return this.getSize()[0];
        },

        getHeight()
        {
            return this.getSize()[1];
        },

        getSize()
        {
            return this._max.subtract(this._min);
        },

        /**
         *  @param {Direction} direction 
         */
        getBorderRegion(direction)
        {
            /** @type {Aabb2} */var region = null;

            var leftTop = this.getLeftTop();
            var size = this.getSize();

            switch(direction) {
            case Direction.LEFT:
                region = Aabb2.fromMinimumAndSize(
                    leftTop.add(new Vector2(-1, 0)),
                    new Vector2(1, size[1])
                );
            break;
            case Direction.RIGHT:
                region = Aabb2.fromMinimumAndSize(
                    leftTop.add(new Vector2(size[0], 0)),
                    new Vector2(1, size[1])
                );
            break;
            case Direction.TOP:
                region = Aabb2.fromMinimumAndSize(
                    leftTop.add(new Vector2(0, -1)),
                    new Vector2(size[0], 1)
                );
            break;
            case Direction.BOTTOM:
                region = Aabb2.fromMinimumAndSize(
                    leftTop.add(new Vector2(0, size[1])),
                    new Vector2(size[0], 1)
                );
            break;
            case Direction.LEFT_TOP:
            case Direction.RIGHT_TOP:
            case Direction.LEFT_BOTTOM:
            case Direction.RIGHT_BOTTOM:
                // TODO : Write code on these cases.
                throw new Error("Not implemented yet.");
            // break;
            default:
                throw new RangeError();
            }

            return region;
        },

        equals(other)
        {
            return (
                this === other
                || (
                    other instanceof Aabb2
                    && (
                        this._min.equals(other._min)
                        && this._max.equals(other._max)
                    )
                )
            );
        },

        intersectsWith(other)
        {
            return !(
                !(other instanceof Aabb2)
                || (
                    relativelyLessThan(this.getRight(), other.getLeft())
                    || relativelyLessThan(other.getRight(), this.getLeft())
                    || relativelyLessThan(this.getBottom(), other.getTop())
                    || relativelyLessThan(other.getBottom(), this.getTop())
                )
            );
        },

        contains(other)
        {
            return !(
                !(other instanceof Aabb2)
                || (
                    relativelyLessThan(other.getLeft(), this.getLeft())
                    || relativelyLessThan(this.getRight(), other.getRight())
                    || relativelyLessThan(other.getTop(), this.getTop())
                    || relativelyLessThan(this.getBottom(), other.getBottom())
                )
            );
        },

        getMinkowskiDifference(other)
        {
            var min = this.getMinimum().subtract(other.getMaximum());

            return Aabb2.fromMinimumAndMaximum(
                min,
                min.add(this.getSize().add(other.getSize()))
            );
        },

        /**
         *  @param {Vector2} direction
         */
        getSupportingPoint(direction)
        {
            return new Vector2(
                (relativelyLessThan(direction[0], 0) ? this.getLeft() : this.getRight()),
                (relativelyLessThan(direction[1], 0) ? this.getTop() : this.getBottom())
            );
        },

        merge()
        {
            /**  @type {Aabb2[]} */var rects = Array.from(arguments);

            var left = this.getLeft();
            var top = this.getTop();
            var right = this.getRight();
            var bottom = this.getBottom();
            for(var i = 0; i < rects.length; ++i) {
                var rect = rects[i];

                if(rect instanceof Aabb2) {
                    if(left > rect.getLeft()) {
                        left = rect.getLeft();
                    }
                    if(top > rect.getTop()) {
                        top = rect.getTop();
                    }
                    if(right < rect.getRight()) {
                        right = rect.getRight();
                    }
                    if(bottom < rect.getBottom()) {
                        bottom = rect.getBottom();
                    }
                }
            }

            return Aabb2.fromMinimumAndMaximum(
                new Vector2(left, top),
                new Vector2(right, bottom)
            );
        },

        toPlainObject()
        {
            return {
                center : this.getCenter(),
                size : this.getSize(),
                left : this.getLeft(),
                top : this.getTop(),
                right : this.getRight(),
                bottom : this.getBottom(),
            };
        },
    };

    return Aabb2;
})();

module.exports = {
    Aabb2 : Aabb2,
};
