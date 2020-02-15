export declare function extendClass<Ac, C, P>(
    parentCtor : Ac,
    ctor : C,
    proto : P
) : (
    {
        new (...args : C extends (...args : any[]) => any ? Parameters<C> : any[]) : (Omit<(Ac extends new (...args : any[]) => infer A ? A : any), keyof P> & P);
        prototype : (Omit<(Ac extends new (...args : any[]) => infer A ? A : any), keyof P> & P);
    }
    & Omit<Ac, "apply"|"call"|"bind"|"name"|"prototype"|"arguments"|"caller"|"length"|"toString">
    & Omit<C, "apply"|"call"|"bind"|"name"|"prototype"|"arguments"|"caller"|"length"|"toString">
);
