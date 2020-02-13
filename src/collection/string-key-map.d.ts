/**
 * A ECMAScript 6 map implementaion using plain ECMAScript object.
 * The type of key is limited to strings.
 */
declare class StringKeyMap<V> implements Map<string, V>
{
    public static wrap<T>(
        src : Record<string, T>
    ) : StringKeyMap<T>;

    public constructor();

    public constructor(
        src : StringKeyMap<V>
    );

    /**
     * Creates a new map and inserts key-value pairs from the specified array.
     *  @param pairs An array of key-value pairs.
     * Each pair is an array whose the first element is key and the second element is value.
     */
    public constructor(
        pairs : [string, V][]
    );

    public constructor(
        src : { [key : string] : V }
    );

    public attach(
        obj : { [key : string] : V }
    ) : void;

    public detach() : { [key : string] : V };

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
        key : string
    ) : boolean;

    public forEach<ThisArg = any>(
        callbackFn : (
            this : ThisArg,
            value : V,
            key : string,
            map : StringKeyMap<V>
        ) => void,
        thisArg? : ThisArg
    ) : void;

    public map<R, ThisArg = any>(
        callbackFn : (
            this : ThisArg,
            value : V,
            key : string,
            map : StringKeyMap<V>
        ) => R,
        thisArg? : ThisArg
    ) : R[];

    public [Symbol.iterator]() : IterableIterator<[string, V]>;

    public entries() : IterableIterator<[string, V]>;

    public keys() : IterableIterator<string>;

    public values() : IterableIterator<V>;

    public get(
        key : string
    ) : V | undefined;

    public has(
        key : string
    ) : boolean;

    public set(
        key : string,
        value : V
    ) : this;

    public toString() : string;

    public toPlainObject() : { [key : string] : V };
}

export {
    StringKeyMap,
};