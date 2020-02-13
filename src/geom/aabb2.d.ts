import { Vector2 } from "./vector2";

declare namespace Aabb2
{
    const enum Direction
    {
        LEFT = 0,
        RIGHT = 1,
        TOP = 2,
        BOTTOM = 3,
        LEFT_TOP = 4,
        RIGHT_TOP = 5,
        LEFT_BOTTOM = 6,
        RIGHT_BOTTOM = 7,
    }
}

declare class Aabb2
{
    public static fromMinimumAndMaximum(
        min : ArrayLike<number>,
        max : ArrayLike<number>
    ) : Aabb2;

    public static fromMinimumAndSize(
        min : Vector2,
        size : Vector2
    ) : Aabb2;

    public static fromCenterAndExtent(
        center : Vector2,
        extent : Vector2
    ) : Aabb2;

    public static merge(
        ...rects : Aabb2[]
    ) : Aabb2;

    public constructor();

    public constructor(
        src : Aabb2
    );

    public getLeft() : number;

    public getTop() : number;

    public getLeftTop() : Vector2;

    public getMinimum() : Vector2;

    public getRight() : number;

    public getBottom() : number;

    public getRightBottom() : Vector2;

    public getMaximum() : Vector2;

    public getCenter() : Vector2;

    public getExtent() : Vector2;

    public getLeftRight() : Vector2;

    public getTopBottom() : Vector2;

    public getAxisRange(
        index : number
    ) : Vector2;

    public getExtremum(
        index : number
    ) : Vector2;

    public getCorner(
        index : number
    ) : Vector2;

    public getWidth() : number;

    public getHeight() : number;

    public getSize() : Vector2;

    public getBorderRegion(
        direction : Aabb2.Direction
    ) : Aabb2;

    public equals(
        other : any
    ) : boolean;

    public intersectsWith(
        other : Aabb2
    ) : boolean;

    public contains(
        other : Aabb2
    ) : boolean;

    public getMinkowskiDifference(
        other : Aabb2
    ) : Aabb2;

    public getSupportingPoint(
        direction : Vector2
    ) : Vector2;

    public merge(
        ...rects : Aabb2[]
    ) : Aabb2;

    public toPlainObject() : {
        center : Vector2,
        extent : Vector2,
    };
}

export {
    Aabb2,
};
