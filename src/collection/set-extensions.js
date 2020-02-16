var forOf = require("./utils").forOf;

/**
 *  @template T
 *  @param {Set<T>} setObj
 *  @param {Iterable<T>} other
 */
function append(setObj, other)
{
    forOf(
        other,
        /**
         *  @this {typeof setObj} 
         */
        function (value)
        {
            this.add(value);
        },
        setObj,
        "values"
    );

    // for(
    //     var i = (Symbol && "function" === typeof Symbol ? other[Symbol.iterator]() : other.values()), iP = i.next();
    //     !iP.done;
    //     iP = i.next()
    // ) {
    //     setObj.add(iP.value);
    // }

    return setObj;
}

/**
 *  @template T
 *  @param {Set<T>} setObj
 *  @param {Iterable<T>} other
 */
function exclude(setObj, other)
{
    forOf(
        other,
        /**
         *  @this {typeof setObj} 
         */
        function (value)
        {
            this["delete"](value);
        },
        setObj,
        "values"
    );

    // for(
    //     var i = (Symbol && "function" === typeof Symbol ? other[Symbol.iterator]() : other.values()), iP = i.next();
    //     !iP.done;
    //     iP = i.next()
    // ) {
    //     setObj["delete"](iP.value);
    // }

    return setObj;
}

/**
 *  @template T
 *  @param {Set<T>} setObj
 *  @param {Set<T>} other
 *  @returns {Iterable<T>}
 */
function difference(setObj, other)
{
    var results = [];

    for(
        var i = setObj.values(), iP = i.next();
        !iP.done;
        iP = i.next()
    ) {
        if(!other.has(iP.value)) {
            results.push(iP.value);
        }
    }

    return results;
}

/**
 *  @template T
 *  @param {Set<T>} setObj
 *  @param {Set<T>} other
 *  @returns {Iterable<T>}
 */
function intersection(setObj, other)
{
    var results = [];

    for(
        var i = other.values(), iP = i.next();
        !iP.done;
        iP = i.next()
    ) {
        if(setObj.has(iP.value)) {
            results.push(iP.value);
        }
    }

    return results;
}

module.exports = {
    append : append,
    exclude : exclude,
    difference : difference,
    intersection : intersection
};
