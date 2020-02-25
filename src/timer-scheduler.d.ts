import { EventNotifierAddOption } from "kaphein-js";

export declare interface TimerEventMap
{
    "ticked" : (
        e : {
            source : Timer;
            context : any;
        }
    ) => void;

    "stopped" : (
        e : {
            source : Timer;
            context : any;
            value : any;
            error : Error | null;
        }
    ) => void;
}

export declare class Timer
{
    public addEventListener<T extends keyof TimerEventMap>(
        eventName : T,
        eventHandler : TimerEventMap[T],
        option? : EventNotifierAddOption
    ) : void;

    public removeEventListener<T extends keyof TimerEventMap>(
        eventName : T,
        eventHandler : TimerEventMap[T]
    ) : void;

    public getTimerScheduler() : TimerScheduler;

    public isRunning() : boolean;

    public getName() : string;

    public getInterval() : number;

    public stop(
        value? : any
    ) : Promise<{
        succeeded : boolean;
        error : Error;
        context : any;
        value : any
    }>;

    public waitForStop() : Promise<{
        succeeded : boolean;
        error : Error;
        context : any;
        value : any
    }>;
}

export declare class TimerScheduler
{
    public constructor(
        option? : {
            Promise? : PromiseConstructor;
        }
    );

    public schedule(
        name : string,
        interval : number,
        context? : any
    ) : Timer;

    public getTimerByName(
        name : string
    ) : Timer | null;

    public stopAll(
        value? : any
    ) : Promise<{
        succeeded : boolean;
        error : Error;
        context : any;
        value : any
    }[]>;

    public waitForStopAll() : Promise<{
        succeeded : boolean;
        error : Error;
        context : any;
        value : any
    }[]>;
}

export {
    TimerEventMap,
    Timer,
    TimerScheduler,
};
