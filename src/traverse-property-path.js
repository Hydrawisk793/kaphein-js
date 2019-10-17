var typeTrait = require("./type-trait");
var isUndefinedOrNull = typeTrait.isUndefinedOrNull;
var isString = typeTrait.isString;
var isCallable = typeTrait.isCallable;

var getterPrefixes = ["get", "is"];

/**
 * @param {*} obj
 * @param {string} fieldName
 */
function findGetterMethodName(obj, fieldName)
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
};

/**
 *  @param {*} obj
 *  @param {string[]([string, any[]][])} path
 */
function traversePropertyPath(obj, path)
{
    var i;
    var currentObj;
    var prevPathToken;
    var pathToken;
    var currentFieldName;
    var finalFieldName;
    var fieldIsFunction;
    var getterArgs;

    for(pathToken = null, currentObj = obj, i = 0; i < path.length; ++i) {
        prevPathToken = pathToken;
        pathToken = path[i];

        if(isUndefinedOrNull(currentObj)) {
            throw new Error(prevPathToken === null ? "The root is undefined or null." : "'" + prevPathToken + "' is undefined or null.");
        }

        if(isString(pathToken)) {
            currentFieldName = pathToken;
            getterArgs = null;
        }
        else if(Array.isArray(pathToken) && pathToken.length > 0) {
            currentFieldName = pathToken[0];
            getterArgs = (pathToken.length > 1 ? pathToken[1] : null);
        }
        else {
            throw new TypeError("Each path token must be a string or an array.");
        }

        finalFieldName = findGetterMethodName(currentObj, currentFieldName);
        if("" !== finalFieldName) {
            fieldIsFunction = true;
        }
        else if(currentFieldName in currentObj) {
            finalFieldName = currentFieldName;
            fieldIsFunction = isCallable(currentObj[currentFieldName]);
        }
        else {
            throw new Error("'" + currentFieldName + "' is undefined or null.");
        }

        if(fieldIsFunction) {
            if(Array.isArray(getterArgs) && getterArgs.length > 0) {
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

    return currentObj;
};

module.exports = {
    traversePropertyPath : traversePropertyPath,
};
