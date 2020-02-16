var deepEquals = require("./comparison").deepEquals;
var shallowEquals = require("./comparison").shallowEquals;
var extendClass = require("./extend-class").extendClass;
var filterObjectKeys = require("./filter-object-keys").filterObjectKeys;
var traversePropertyPath = require("./property-utils").traversePropertyPath;
var normalizePropertyPath = require("./property-utils").normalizePropertyPath;

module.exports = {
    deepEquals : deepEquals,
    shallowEquals : shallowEquals,

    extendClass : extendClass,
    filterObjectKeys : filterObjectKeys,

    traversePropertyPath : traversePropertyPath,
    normalizePropertyPath : normalizePropertyPath
};
