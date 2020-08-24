export declare function toDelimiterSeparatedCase(
    text : string,
    delimiter? : string,
    option? : {}
) : string;

export declare function toCapitalizedCase(
    text : string,
    delimiter? : string | RegExp,
    option? : {
        capitalizeInitial? : boolean;
    }
) : string;

/**
 *  @deprecated Use `toCapitalizedCase` function instead.
 */
export declare function toCamelCase(
    str : string,
    delimiter : string
) : string;
