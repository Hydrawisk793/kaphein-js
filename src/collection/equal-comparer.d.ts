declare type EqualComparer<T> = (
    lhs : T,
    rhs : T
) => boolean;

export {
    EqualComparer,
};
