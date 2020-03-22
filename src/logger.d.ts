export declare interface Logger
{
    public debug(
        ...args : any[]
    ) : void;

    public trace(
        ...args : any[]
    ) : void;

    public info(
        ...args : any[]
    ) : void;

    public warn(
        ...args : any[]
    ) : void;

    public error(
        ...args : any[]
    ) : void;
}
