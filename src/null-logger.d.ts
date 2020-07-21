import { Logger } from "./logger";

export declare class NullLogger implements Logger
{
    public constructor();

    public debug(
        ...args : any[]
    ) : void;

    public log(
        ...args : any[]
    ) : void;

    public info(
        ...args : any[]
    ) : void;

    public trace(
        ...args : any[]
    ) : void;

    public warn(
        ...args : any[]
    ) : void;

    public error(
        ...args : any[]
    ) : void;
}
