declare class Vector2 implements ArrayLike<number>
{
    public static zero() : Vector2;

    public static one() : Vector2;

    public static fill(
        value : number
    ) : Vector2;

    public static isCompatibleArrayLike(
        v : any
    ) : v is ArrayLike<number>;

    public constructor();

    public constructor(
        src : ArrayLike<number>
    );

    public constructor(
        obj : {
            x : number,
            y : number,
        }
    );

    public constructor(
        x : number,
        y : number
    );

    public readonly length : number;

    public readonly [ index : number ] : number;

    public clone() : Vector2;

    public setXy(
        x : number,
        y : number
    ) : this;

    public negate() : Vector2;

    public dot(
        other : ArrayLike<number>
    ) : number;

    public norm2Squared() : number;

    public norm2() : number;

    public normalize() : Vector2;

    public project(
        axis : ArrayLike<number>
    ) : Vector2;

    public add(
        other : ArrayLike<number>
    ) : Vector2;

    public subtract(
        other : ArrayLike<number>
    ) : Vector2;

    public scale(
        scalar : number
    ) : Vector2;

    public pointwiseMultiply(
        other : ArrayLike<number>
    ) : Vector2;

    public isZero() : boolean;

    public equals(
        other : any
    ) : boolean;

    public assign(
        other : ArrayLike<number>
    ) : this;

    public negateAssign() : this;

    public addAssign(
        other : ArrayLike<number>
    ) : this;

    public subtractAssign(
        other : ArrayLike<number>
    ) : this;

    public scaleAssign(
        scalar : number
    ) : this;

    public pointwiseMultiplyAssign(
        other : ArrayLike<number>
    ) : this;

    public toArray() : [number, number];

    /**
     *  @override
     */
    public toString() : string;
}

export {
    Vector2,
};
