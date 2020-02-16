var isUndefinedOrNull = require("../type-trait").isUndefinedOrNull;
var isString = require("../type-trait").isString;
var isCallable = require("../type-trait").isCallable;
var isArray = require("../type-trait").isArray;

module.exports = (function ()
{
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
     *  @typedef {import("./property-utils").PropertyPath} PropertyPath
     *  @typedef {import("./property-utils").PropertyTraversalOption} PropertyTraversalOption
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

    /**
     *  @returns {PropertyPath}
     */
    function normalizePropertyPath(arg)
    {
        var path;

        if(isString(arg)) {
            path = arg
                .split(".")
                .filter(
                    function (token)
                    {
                        return token.length > 0;
                    }
                )
            ;

            if(path.length > 0 && arguments.length > 1 && isArray(arguments[1])) {
                path[path.length - 1] = [path[path.length - 1], arguments[1]];
            }
        }
        else if(isArray(arg)) {
            path = arg
                .filter(
                    function (token)
                    {
                        var isValid = isString(token);

                        if(!isValid) {
                            isValid = isArray(token);

                            if(isValid) {
                                switch(token.length) {
                                case 0:
                                    isValid = false;
                                break;
                                default:
                                    isValid = isString(token[0]);

                                    if(isValid && token.length > 1) {
                                        isValid = isArray(token[1]);
                                    }
                                }
                            }
                        }

                        return isValid;
                    }
                )
            ;
        }
        else {
            throw new TypeError("The first argument must be a string or an array.");
        }

        return path;
    }

    return {
        traversePropertyPath : traversePropertyPath,
        normalizePropertyPath : normalizePropertyPath
    };
})();
