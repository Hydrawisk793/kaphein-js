declare class EventNotifier
{
    public constructor(
        options? : {
            Map? : Function,
            Set? : Function,
            Symbol? : Function
        }
    );

    public add(
        eventName : string,
        handler : Function
    ) : EventNotifier;

    public remove(
        eventName : string,
        handler : Function
    ) : EventNotifier;

    public removeAll(
        eventName : string,
        handler : Function
    ) : EventNotifier;

    public notify(
        eventName : string,
        eventArgs : any
    ) : EventNotifier;
}

export {
    EventNotifier
};
