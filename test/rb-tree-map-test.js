var RbTreeSearchTarget = require("../src").RbTreeSearchTarget;
var RbTreeMap = require("../src").RbTreeMap;
var forOf = require("../src").forOf;

/**
 *  @param {string} l
 *  @param {string} r
 */
function compareString(l, r)
{
    return l.localeCompare(r);
}

var map = new RbTreeMap(null, compareString);

map.set("foo", 1);
map.set("bar", 2);
map.set("baz", 3);
console.log(map.size);
map.forEach(
    function (value, key)
    {
        console.log(key, " => ", value);
    }
);
forOf(
    map,
    function (pair)
    {
        console.log(pair);
    }
);
console.log(map.size, map.toString());

map.set("baz", 102);
console.log(map.size, map.toString());

map["delete"]("baz");
console.log(map.size, map.toString());

map.set("arb", 123123123);
console.log(map.size, map.toString());

map.set("bab", 13);
console.log(map.size, map.toString());

console.log("less than \"bac\" : ", map.findEntry("bac", RbTreeSearchTarget.less));

console.log("first : ", map.getFirst());
console.log("last : ", map.getLast());

map.clear();
console.log(map.size, map.toString());
