declare interface PromiseConstructor
{
    allSettled<T = any>(
        iterable : Iterable<PromiseLike<T>>
    ) : Promise<
        [
            {
                status : "fulfilled";
                value : T;
            }
            | {
                status : "rejected";
                reason : any;
            }
        ]
    >;
} 
