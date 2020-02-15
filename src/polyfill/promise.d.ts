declare interface PromiseConstructor
{
    allSettled(
        iterable : Iterable<PromiseLike<any>>
    ) : Promise<
        [
            {
                status : string;
                value : any;
            }
            | {
                status : string;
                reason : any;
            }
        ]
    >;
} 
