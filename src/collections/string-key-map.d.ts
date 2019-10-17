/**
 * A ECMAScript 6 map implementaion using plain ECMAScript object.
 * The type of key is limited to strings.
 */
declare class StringKeyMap<V> implements Map<string, V>
{
    public constructor();

    public constructor(
        src : StringKeyMap<V>
    );

    public constructor(
        src : { [key : string] : V }
    );

    /**
     * Creates a new map and inserts key-value pairs from the specified array.
     * @param arr An array of key-value pairs.
     * Each pair is an array whose the first element is key and the second element is value.
     */
    public constructor(
        arr : string[][]
    );

    /**
     * Gets the number of key-value pair in the map.
     */
    public readonly size : number;

    public [Symbol.toStringTag] : string;

    public attach(
        obj : { [key : string] : V }
    ) : void;

    public detach() : { [key : string] : V };

    public getSize() : number;

    /**
     * Removes all elements in the map.
     */
    public clear() : void;

    public delete(
        key : string
    ) : boolean;

    public forEach(
        callbackFn : (
            value : V,
            key : string,
            map : Map<string, V>
        ) => void,
        thisArg? : any
    ) : void;

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

    public toPlainObject() : object;
}

export {
    StringKeyMap,
};
