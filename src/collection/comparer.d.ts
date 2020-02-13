declare type Comparer<T> = (
    lhs : T,
    rhs : T
) => number;

export {
    Comparer,
};
