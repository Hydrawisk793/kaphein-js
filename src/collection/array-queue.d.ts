export declare class ArrayQueue<T> implements Iterable<T>
{
    public constructor(
        iterable? : Iterable<T>
    );

    public readonly size : number;

    public [Symbol.iterator]() : Iterator<T>;

    public entries() : IterableIterator<[number, T]>;

    public keys() : IterableIterator<number>;

    public values() : IterableIterator<T>;

    public isEmpty() : boolean;

    public enqueue(
        element : T
    ) : void;

    public dequeue() : T | undefined;

    public clear() : void;

    public [Symbol.toStringTag] : string;
}
