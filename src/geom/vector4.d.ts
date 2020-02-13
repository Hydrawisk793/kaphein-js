declare class Vector4 implements ArrayLike<number>
{
    public static zero() : Vector4;

    public static one() : Vector4;

    public static fill(
        value : number
    ) : Vector4;

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
            z : number,
            w : number,
        }
    );

    public constructor(
        x : number,
        y : number,
        z : number,
        w : number
    );

    public readonly length : number;

    public readonly [ index : number ] : number;

    public clone() : Vector4;

    public setXyzw(
        x : number,
        y : number,
        z : number,
        w : number
    ) : this;

    public negate() : Vector4;

    public dot(
        other : ArrayLike<number>
    ) : number;

    public norm2Squared() : number;

    public norm2() : number;

    public normalize() : Vector4;

    public project(
        axis : ArrayLike<number>
    ) : Vector4;

    public add(
        other : ArrayLike<number>
    ) : Vector4;

    public subtract(
        other : ArrayLike<number>
    ) : Vector4;

    public scale(
        scalar : number
    ) : Vector4;

    public pointwiseMultiply(
        other : ArrayLike<number>
    ) : Vector4;

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

    public toArray() : [number, number, number, number];

    /**
     *  @override
     */
    public toString() : string;
}

export {
    Vector4,
};
