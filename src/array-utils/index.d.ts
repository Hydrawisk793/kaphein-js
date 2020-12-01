export declare function findArrayChanges<T>(
    prev : T[],
    current : T[],
    itemComparer? : (lhs : T, rhs : T) => boolean
) : {
    removedItems : T[];
    addedItems : T[];
};

export declare function coerceToArray<T>(
    v : T | T[]
) : T[];

export declare type FlattenArray<
    Element
> = {
    0 : Element,
    1 : (
        Element extends Array<infer Inner>
            ? FlattenArray<Inner>
            : Element
    )
}[Element extends Array<any> ? 1 : 0];

export declare function flatten<T>(
    arr : T
) : FlattenArray<T>[];
