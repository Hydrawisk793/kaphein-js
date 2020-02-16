export declare function memoize<F extends Function>(
    func : F,
    option? : {
        thisArg? : any;

        equalComparer? : (lhs : any, rhs : any) => boolean;

        argsEqualComparer? : (prevArgs : any[], nextArgs : any[]) => boolean;

        resultEqualComparer? : (lhs : any, rhs : any) => boolean;

        alwaysEvaluate? : boolean;

        reuseResultReferenceIfPossible? : boolean;
    }
) : typeof func;
