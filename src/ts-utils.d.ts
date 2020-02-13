declare type PickExtends<S, T> = Pick<S, { [K in keyof S] : (S[K] extends T ? K : never) }[keyof S]>;

declare type BoundFunction<FunctionType extends (...args : any[]) => any, ThisType> = (this : ThisType, ...args : Parameters<FunctionType>) => ReturnType<FunctionType>;

declare type PromiseThenType<T> = T extends PromiseLike<infer U> ? U : T;

export {
    PickExtends,
    BoundFunction,
    PromiseThenType,
};
