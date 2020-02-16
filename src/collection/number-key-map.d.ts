/**
 * A ECMAScript 6 map implementaion using plain ECMAScript object.
 * The type of key is limited to numbers.
 */
export declare class NumberKeyMap<V> implements Map<number, V>
{
    public static wrap<T>(
        src : Record<number, T>
    ) : NumberKeyMap<T>;

    /**
     * Creates a new map and inserts key-value pairs from the specified array.
     *  @param iterable An array of key-value pairs.
     * Each pair is an array whose the first element is key and the second element is value.
     */
    public constructor(
        iterable? : Iterable<[number, V]>
    );

    public attach(
        obj : { [key : number] : V }
    ) : void;

    public detach() : { [key : number] : V };

    public [Symbol.toStringTag] : string;

    /**
     * Gets the number of key-value pair in the map.
     */
    public readonly size : number;

    public getSize() : number;

    /**
     * Removes all elements in the map.
     */
    public clear() : void;

    public delete(
        key : number
    ) : boolean;

    public forEach<ThisArg = any>(
        callbackFn : (
            this : ThisArg,
            value : V,
            key : number,
            map : NumberKeyMap<V>
        ) => void,
        thisArg? : ThisArg
    ) : void;

    public map<R, ThisArg = any>(
        callbackFn : (
            this : ThisArg,
            value : V,
            key : number,
            map : NumberKeyMap<V>
        ) => R,
        thisArg? : ThisArg
    ) : R[];

    public [Symbol.iterator]() : IterableIterator<[number, V]>;

    public entries() : IterableIterator<[number, V]>;

    public keys() : IterableIterator<number>;

    public values() : IterableIterator<V>;

    public get(
        key : number
    ) : V | undefined;

    public has(
        key : number
    ) : boolean;

    public set(
        key : number,
        value : V
    ) : this;

    public toString() : string;

    public toPlainObject() : { [key : number] : V };
}
