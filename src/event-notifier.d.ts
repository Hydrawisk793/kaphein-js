export declare interface EventNotifierAddOption
{
    once? : boolean;
}

export declare class EventNotifier
{
    public constructor();

    public getHandlerCountOf(
        eventName : string
    ) : number;

    public add(
        eventName : string,
        handler : Function,
        option? : EventNotifierAddOption
    ) : this;

    public remove(
        eventName : string,
        handler : Function
    ) : this;

    public removeAll(
        eventName? : string
    ) : this;

    public notify(
        eventName : string,
        eventArgs : any
    ) : any[];

    public dispatch(
        eventName : string,
        eventArgs : any,
        onFinished? : (
            e : {
                source : EventNotifier;
                eventName : string;
                eventArgs : any;
                results : any[] | null;
                error : any | null;
            }
        ) => void
    ) : this;
}
