export declare type LoggerMessageDecorator = (
    args : any[],
    logger : Logger
) => typeof args;

export declare class Logger
{
    public constructor();

    public constructor(
        console : Console
    );

    public getMessageDecorators() : LoggerMessageDecorator[];

    public addMessageDecorator(
        messageDecorator : LoggerMessageDecorator
    ) : void;

    public removeMessageDecorator(
        messageDecorator : LoggerMessageDecorator
    ) : void;

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
