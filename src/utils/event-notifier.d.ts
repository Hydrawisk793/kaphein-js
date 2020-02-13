declare class EventNotifier
{
    public constructor();

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

    public dispatch(
        eventName : string,
        eventArgs : any
    ) : EventNotifier;
}

export {
    EventNotifier,
};
