export declare type PropertyPath = ([string, any[]] | string)[];

export declare interface PropertyTraversalOption
{
    throwErrorIfNotFound? : boolean;

    defaultValue? : any;
    
    getterArgs? : any[];
}

export declare function traversePropertyPath(
    obj : any,
    path : PropertyPath,
    option? : PropertyTraversalOption
) : any;

export declare function normalizePropertyPath(
    args : any[],
) : PropertyPath;

export declare function normalizePropertyPath(
    path : string,
    getterArgs? : any[]
) : PropertyPath;
