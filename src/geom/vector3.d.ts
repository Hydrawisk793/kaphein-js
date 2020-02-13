declare class Vector3 implements ArrayLike<number>
{
    public static zero() : Vector3;

    public static one() : Vector3;

    public static fill(
        value : number
    ) : Vector3;

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
        }
    );

    public constructor(
        x : number,
        y : number,
        z : number
    );

    public readonly length : number;

    public readonly [ index : number ] : number;

    public clone() : Vector3;

    public setXyz(
        x : number,
        y : number,
        z : number
    ) : this;

    public negate() : Vector3;

    public cross(
        other : ArrayLike<number>
    ) : Vector3;

    public dot(
        other : ArrayLike<number>
    ) : number;

    public norm2Squared() : number;

    public norm2() : number;

    public normalize() : Vector3;

    public project(
        axis : ArrayLike<number>
    ) : Vector3;

    public add(
        other : ArrayLike<number>
    ) : Vector3;

    public subtract(
        other : ArrayLike<number>
    ) : Vector3;

    public scale(
        scalar : number
    ) : Vector3;

    public pointwiseMultiply(
        other : ArrayLike<number>
    ) : Vector3;

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

    public toArray() : [number, number, number];

    /**
     *  @override
     */
    public toString() : string;
}

export {
    Vector3,
};
