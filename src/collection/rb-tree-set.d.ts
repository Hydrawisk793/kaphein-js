import { Comparer } from "./comparer";

declare namespace RbTreeSet
{
    const enum SearchTarget
    {
        less = 0,
        lessOrEqual = 1,
        greater = 2,
        greaterOrEqual = 3,
        equal = 4,
    }

    class CppValueIterator<T>
    {
        public equals(
            other : any
        ) : boolean;

        public isNull() : boolean;

        public dereference() : T;

        public moveToNext() : boolean;

        public moveToPrevious() : boolean;
    }
}

declare class RbTreeSet<T> implements Set<T>
{
    public constructor(
        iterable? : Iterable<T>,
        comparer? : Comparer<T>
    );

    public [Symbol.toStringTag] : string;

    public readonly size : number;

    public getElementCount() : number;

    public isEmpty() : boolean;

    public forEach(
        callbackfn : (
            value : T,
            value2 : T,
            set : Set<T>
        ) => void,
        thisArg? : any
    ) : void;

    public begin() : RbTreeSet.CppValueIterator<T>;

    public end() : RbTreeSet.CppValueIterator<T>;

    public [Symbol.iterator]() : IterableIterator<T>;

    public entries() : IterableIterator<[T, T]>;

    public keys() : IterableIterator<T>;

    public values() : IterableIterator<T>;

    public find(
        value : T,
        searchTarget : RbTreeSet.SearchTarget
    ) : RbTreeSet.CppValueIterator<T>;

    public has(
        value : T
    ) : boolean;

    public add(
        value : T
    ) : this;

    public delete(
        value : T
    ) : boolean;

    public clear() : void;

    public toString() : string;
}

export {
    RbTreeSet,
};
