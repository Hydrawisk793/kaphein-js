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

export declare function flatten(
    arr : any[]
) : any[];
