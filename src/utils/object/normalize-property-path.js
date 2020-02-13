var typeTrait = require("../type-trait");
var isString = typeTrait.isString;
var isArray = typeTrait.isArray;

/**
 *  @typedef {import("./property-path").PropertyPath} PropertyPath
 */

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

module.exports = {
    normalizePropertyPath,
};
