export declare class PseudoPromise<T> implements Promise<T>
{
    public constructor(
        executor : (
            resolve : (
                value : T
            ) => void,
            reject : (
                reason : any
            ) => void
        ) => void
    );

    public then<F = T, R = never>(
        onFulfiled : ((value : T) => F | PseudoPromise<F>) | undefined | null,
        onRejected? : ((reason : R) => R | PseudoPromise<R>) | undefined | null
    ) : Promise<F, R>;

    public catch<R = never>(
        onRejected? : ((reason: any) => R | PseudoPromise<R>) | undefined | null
    ) : Promise<T | R>;
}
