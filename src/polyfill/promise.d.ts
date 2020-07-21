declare interface PromiseConstructor
{
    fuckingShit() : void;

    allSettled(
        iterable : Iterable<PromiseLike<any>>
    ) : Promise<
        [
            {
                status : "fulfilled";
                value : any;
            }
            | {
                status : "rejected";
                reason : any;
            }
        ]
    >;
} 
