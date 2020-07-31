export declare function pickKeys<T>(
    obj : T,
    predicate : (keyof T)[]
        | ((value : T[keyof T], key : keyof T, obj : T) => boolean)
        | Record<keyof T, any>
) : (keyof T)[];

export declare function pick<T>(
    obj : T,
    predicate : (keyof T)[]
        | ((value : T[keyof T], key : keyof T, obj : T) => boolean)
        | Record<keyof T, any>
) : Partial<T>;

export declare function omitKeys<T>(
    obj : T,
    predicate : (keyof T)[]
        | ((value : T[keyof T], key : keyof T, obj : T) => boolean)
        | Record<keyof T, any>
) : (keyof T)[];

export declare function omit<T>(
    obj : T,
    predicate : (keyof T)[]
        | ((value : T[keyof T], key : keyof T, obj : T) => boolean)
        | Record<keyof T, any>
) : Partial<T>;
