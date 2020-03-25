export declare interface Logger
{
    debug(
        ...args : any[]
    ) : void;

    trace(
        ...args : any[]
    ) : void;

    info(
        ...args : any[]
    ) : void;

    warn(
        ...args : any[]
    ) : void;

    error(
        ...args : any[]
    ) : void;
}
