var deepEquals = require("./comparison").deepEquals;
var shallowEquals = require("./comparison").shallowEquals;
var extendClass = require("./extend-class").extendClass;
var pickKeys = require("./filter").pickKeys;
var pick = require("./filter").pick;
var omitKeys = require("./filter").omitKeys;
var omit = require("./filter").omit;
var filterObjectKeys = require("./filter-object-keys").filterObjectKeys;
var traversePropertyPath = require("./property-utils").traversePropertyPath;
var normalizePropertyPath = require("./property-utils").normalizePropertyPath;

module.exports = {
    deepEquals : deepEquals,
    shallowEquals : shallowEquals,

    extendClass : extendClass,
    pickKeys : pickKeys,
    pick : pick,
    omitKeys : omitKeys,
    omit : omit,
    filterObjectKeys : filterObjectKeys,

    traversePropertyPath : traversePropertyPath,
    normalizePropertyPath : normalizePropertyPath
};
