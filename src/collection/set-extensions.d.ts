declare function append<T>(
    setObj : Set<T>,
    other : Iterable<T>
) : Set<T>;

declare function exclude<T>(
    setObj : Set<T>,
    other : Iterable<T>
) : Set<T>;

declare function difference<T>(
    setObj : Set<T>,
    other : Set<T>
) : Iterable<T>;

declare function intersection<T>(
    setObj : Set<T>,
    other : Set<T>
) : Iterable<T>;

export {
    append,
    exclude,
    difference,
    intersection,
};
