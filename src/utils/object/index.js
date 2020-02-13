var typeTrait = require("../type-trait");
var isUndefinedOrNull = typeTrait.isUndefinedOrNull;
var isString = typeTrait.isString;
var isCallable = typeTrait.isCallable;
var isArray = typeTrait.isArray;
var relativelyEquals = require("../number").relativelyEquals;
var normalizePropertyPath = require("./normalize-property-path").normalizePropertyPath;
var extendClass = require("./extend-class").extendClass;
var constructWithArguments = require("./construct-with-arguments").constructWithArguments;

var defaultDeepEqualityComparisionOption = {
    maximumDepth : Number.MAX_SAFE_INTEGER,
};

/**
 *  @param {typeof defaultDeepEqualityComparisionOption} [option]
 */
function deepEquals(l, r, option)
{
    var context;
    var typeOfLhs
    var lhs, rhs;
    var lhsKeys, rhsKeys;
    var key;
    var keyIndex;
    var contextStack;
    var areEqual;
    var maximumDepth;

    option = (isUndefinedOrNull(option) ? defaultDeepEqualityComparisionOption : option);
    maximumDepth = option.maximumDepth;

    contextStack = [];
    contextStack.splice(
        contextStack.length - 1,
        0,
        {
            lhs : l,
            rhs : r,
            depth : 0,
        }
    );

    for(areEqual = true; areEqual && contextStack.length > 0; ) {
        context = contextStack.splice(contextStack.length - 1, 1)[0];

        lhs = context.lhs;
        rhs = context.rhs;
        areEqual = lhs === rhs;

        if(!areEqual && context.depth < maximumDepth) {
            typeOfLhs = typeof lhs;

            if(typeOfLhs === typeof rhs) {
                switch(typeOfLhs) {
                case "undefined":
                    areEqual = true;
                break;
                case "number":
                    areEqual = relativelyEquals(lhs, rhs);
                break;
                case "object":
                    if(isArray(lhs) && isArray(rhs)) {
                        for(keyIndex = lhs.length, areEqual = lhs.length === rhs.length; areEqual && keyIndex > 0; ) {
                            --keyIndex;

                            contextStack.splice(
                                context.length - 1,
                                0,
                                {
                                    lhs : lhs[keyIndex],
                                    rhs : rhs[keyIndex],
                                    depth : context.depth + 1,
                                }
                            );
                        }
                    }
                    else if(lhs instanceof RegExp && rhs instanceof RegExp) {
                        areEqual = lhs.source === rhs.source
                            && lhs.flags.split("").sort().join("") === rhs.flags.split("").sort().join("")
                        ;
                    }
                    else if(lhs instanceof Date && rhs instanceof Date) {
                        areEqual = lhs.getTime() === rhs.getTime();
                    }
                    else if(null !== lhs && null !== rhs) {
                        lhsKeys = Object.keys(lhs);
                        rhsKeys = Object.keys(rhs);

                        areEqual = lhsKeys.length === rhsKeys.length;
                        if(areEqual) {
                            lhsKeys.sort();
                            rhsKeys.sort();

                            for(keyIndex = lhsKeys.length; areEqual && keyIndex > 0; ) {
                                --keyIndex;

                                areEqual = lhsKeys[keyIndex] === rhsKeys[keyIndex];
                            }

                            for(keyIndex = lhsKeys.length; areEqual && keyIndex > 0; ) {
                                --keyIndex;

                                key = lhsKeys[keyIndex];
                                contextStack.splice(
                                    context.length - 1,
                                    0,
                                    {
                                        lhs : lhs[key],
                                        rhs : rhs[key],
                                        depth : context.depth + 1,
                                    }
                                );
                            }
                        }
                    }
                break;
                default:

                }
            }
        }
    }

    return areEqual;
}

function shallowEquals(lhs, rhs)
{
    return deepEquals(lhs, rhs, { maximumDepth : 1 });
}

/**
 *  @param {*} obj
 *  @param {string[] | ((key : string) => boolean)} predicate
 *  @returns {{ [x : string] : any }}
 */
function filterObjectKeys(obj, predicate)
{
    var i;
    var keys, key;
    var result;

    result = {};

    if(!isUndefinedOrNull(obj)) {
        if(isArray(predicate)) {
            for(i = 0; i < predicate.length; ++i) {
                key = predicate[i];

                if(key in obj) {
                    result[key] = obj[key];
                }
            }
        }
        else if(isCallable(predicate)) {
            for(keys = Object.keys(obj), i = 0; i < keys.length; ++i) {
                key = keys[i];

                if(predicate(key)) {
                    result[key] = obj[key];
                }
            }
        }
        else {
            throw new TypeError("'predicate' must be an array of string or a function.");
        }
    }

    return result;
}

var getterPrefixes = ["get", "is", "has"];

/**
 *  @param {*} obj
 *  @param {string} fieldName
 */
function _findGetterMethodName(obj, fieldName)
{
    var i;
    var finalMethodName = "";
    var suffix = fieldName[0].toUpperCase() + fieldName.slice(1);
    var methodName;

    for(finalMethodName = "", i = 0; "" === finalMethodName && i < getterPrefixes.length; ++i) {
        methodName = getterPrefixes[i] + suffix;

        if(isCallable(obj[methodName])) {
            finalMethodName = methodName;
        }
    }

    return finalMethodName;
}

/**
 *  @typedef {import("./property-path").PropertyPath} PropertyPath
 */

/**
 *  @typedef {Object} PropertyTraversalOption
 *  @property {boolean} [throwErrorIfNotFound]
 *  @property {*} [defaultValue]
 *  @property {*[]} [getterArgs]
 */

/**
 *  @param {*} obj
 *  @param {PropertyPath} path
 *  @param {PropertyTraversalOption} [option]
 */
function traversePropertyPath(obj, path, option)
{
    var i;
    var currentObj;
    var prevPathToken;
    var pathToken;
    var currentFieldName;
    var finalFieldName;
    var fieldIsFunction;
    var getterArgs;

    option = isUndefinedOrNull(option) ? {} : option;

    if(isString(path)) {
        path = path
            .split(".")
            .filter(
                function (propertyName)
                {
                    return propertyName.length > 0;
                }
            )
        ;
    }
    else if(!isArray(path)) {
        throw new TypeError("'path' must be a string or an array.");
    }

    for(pathToken = null, currentObj = obj, i = 0; i < path.length; ++i) {
        prevPathToken = pathToken;
        pathToken = path[i];

        if(isUndefinedOrNull(currentObj)) {
            if(option.throwErrorIfNotFound) {
                throw new Error(null === prevPathToken ? "The root is undefined or null." : "'" + prevPathToken + "' is undefined or null.");
            }
            else {
                currentObj = option.defaultValue;
                i = path.length;
            }
        }
        else {
            if(isString(pathToken)) {
                currentFieldName = pathToken;
                getterArgs = null;
            }
            else if(isArray(pathToken) && pathToken.length > 0) {
                currentFieldName = pathToken[0];
                getterArgs = (pathToken.length > 1 ? pathToken[1] : null);
            }
            else {
                throw new TypeError("Each path token must be a string or an array.");
            }

            if(i === path.length - 1 && null === getterArgs && isArray(option.getterArgs)) {
                getterArgs = option.getterArgs;
            }

            finalFieldName = "";
            if(currentFieldName in currentObj) {
                finalFieldName = currentFieldName;
                fieldIsFunction = isCallable(currentObj[currentFieldName]);
            }
            else {
                finalFieldName = _findGetterMethodName(currentObj, currentFieldName);
                if("" !== finalFieldName) {
                    fieldIsFunction = true;
                }
            }

            if("" !== finalFieldName) {
                if(fieldIsFunction) {
                    if(isArray(getterArgs) && getterArgs.length > 0) {
                        currentObj = currentObj[finalFieldName].apply(currentObj, getterArgs);
                    }
                    else {
                        currentObj = currentObj[finalFieldName]();
                    }
                }
                else {
                    currentObj = currentObj[finalFieldName];
                }
            }
            else if(option.throwErrorIfNotFound) {
                throw new Error("'" + currentFieldName + "' does not exist.");
            }
            else {
                currentObj = option.defaultValue;
                i = path.length;
            }
        }
    }

    return currentObj;
}

module.exports = {
    constructWithArguments : constructWithArguments,
    extendClass : extendClass,
    filterObjectKeys : filterObjectKeys,

    deepEquals : deepEquals,
    shallowEquals : shallowEquals,

    traversePropertyPath : traversePropertyPath,
    normalizePropertyPath : normalizePropertyPath,
};
