/**
 *  @deprecated Use `pick` or `omit` instead.
 */
export declare function filterObjectKeys(
    obj : any,
    predicate : string[] | ((value : any, key : string) => boolean)
) : Record<string, any>;

/**
 *  @deprecated Use `pick` or `omit` instead.
 */
export declare function filterObjectKeys(
    obj : any,
    predicate : ((key : string) => boolean)
) : Record<string, any>;
