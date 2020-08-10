import { Comparer } from "./comparer";
import { RbTreeSearchTarget } from "./rb-tree-search-target";

export declare class RbTreeMap<K, V> implements Map<K, V>
{
    public constructor(
        iterable? : Iterable<[K, V]> | null,
        keyComparer? : Comparer<K>
    );

    public readonly size : number;

    public getElementCount() : number;

    public clear() : void;

    public delete(
        key : K
    ) : boolean;

    public remove(
        key : K
    ) : boolean;

    public forEach(
        callbackFn : (
            value : V,
            key : K,
            map : RbTreeMap<K, V>
        ) => void,
        thisArg? : any
    ) : void;

    public [Symbol.iterator]() : IterableIterator<[K, V]>;

    public entries() : IterableIterator<[K, V]>;

    public keys() : IterableIterator<K>;

    public values() : IterableIterator<V>;

    public findEntry(
        key : K,
        searchTarget : RbTreeSearchTarget
    ) : [K, V] | undefined;

    /**
     *  @deprecated Use 'findEntry' method with 'RbTreeSearchTarget' enum instead.
     */
    public findLessThan(
        key : K
    ) : [K, V] | undefined;

    /**
     *  @deprecated Use 'findEntry' method with 'RbTreeSearchTarget' enum instead.
     */
    public findNotGreaterThan(
        key : K
    ) : [K, V] | undefined;

    /**
     *  @deprecated Use 'findEntry' method with 'RbTreeSearchTarget' enum instead.
     */
    public findGreaterThan(
        key : K
    ) : [K, V] | undefined;

    /**
     *  @deprecated Use 'findEntry' method with 'RbTreeSearchTarget' enum instead.
     */
    public findNotLessThan(
        key : K
    ) : [K, V] | undefined;

    public getFirst() : [K, V] | undefined;

    public getLast() : [K, V] | undefined;

    public get(
        key : K
    ) : V | undefined;

    public has(
        key : K
    ) : boolean;

    public set(
        key : K,
        value : V
    ) : this;

    public tryAdd(
        key : K,
        value : V
    ) : boolean;

    /**
     *  @override
     */
    public toString() : string;

    public [Symbol.toStringTag] : string;
}
