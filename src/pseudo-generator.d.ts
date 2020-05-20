export declare interface PseudoGeneratorContext<
    State extends Record<number | string | symbol, any> = Record<number | string | symbol, any>,
    Args extends any[] = any[],
    T = unknown,
    TReturn = any,
    TNext = unknown
>
{
    state : State;

    args : Args;

    lastYieldedValue : T;

    nextArgs : any[] | [TNext];

    finish : () => void;

    delegate : (
        generator : Generator | AsyncGenerator
    ) => void;
}

export declare type PseudoAsyncGeneratorExecutor<
    State = Record<number | string | symbol, any>,
    Args extends any[] = any[],
    T = unknown,
    TReturn = any,
    TNext = unknown
> = <
    State = Record<number | string | symbol, any>,
    Args extends any[] = any[],
    T = unknown,
    TReturn = any,
    TNext = unknown
>(
    context : PseudoGeneratorContext<State, Args, T, TReturn, TNext>
) => T | TReturn | Promise<T> | Promise<TReturn>;

export declare function createPseudoAsyncGeneratorFunction<
    State = Record<number | string | symbol, any>,
    Args extends any[] = any[],
    T = unknown,
    TReturn = any,
    TNext = unknown
>(
    executor : PseudoAsyncGeneratorExecutor<State, Args, T, TReturn, TNext>,
    option? : {
        Promise? : PromiseConstructor;
    }
) : (...args : Args) => AsyncGenerator<T, TReturn, TNext>;
