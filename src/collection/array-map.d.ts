import { EqualComparer } from "./equal-comparer";

declare class ArrayMap<K, V> implements Map<K, V>
{
    public constructor(
        iterable? : Iterable<[K, V]>,
        keyEqualComparer? : EqualComparer<K>
    );

    public [Symbol.toStringTag] : string;

    public readonly size : number;

    public getElementCount() : number;

    public forEach(
        callbackfn : (
            value : V,
            key : K,
            map : Map<K, V>
        ) => void,
        thisArg? : any
    ) : void;

    public [Symbol.iterator]() : IterableIterator<[K, V]>;

    public entries() : IterableIterator<[K, V]>;

    public keys() : IterableIterator<K>;

    public values() : IterableIterator<V>;

    public has(
        key : K
    ) : boolean;

    public findIndex(
        callback : (
            value : [K, V],
            index : number 
        ) => boolean,
        thisArg? : any
    ) : number;

    public indexOf(
        key : K
    ) : number;

    public get(
        key : K
    ) : V;

    public get(
        key : K,
        defaultValue : V
    ) : V;

    public getAt(
        index : number
    ) : [K, V];

    public set(
        key : K,
        value : V
    ) : this;

    public delete(
        key : K
    ) : boolean;

    public clear() : void;

    public toArray() : [K, V][];
}

export {
    ArrayMap,
};
