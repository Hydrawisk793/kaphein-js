const { assert } = require("chai");

const { toCapitalizedCase } = require("../../../src");

module.exports = function ()
{
    it("snake_case to camelCase", function ()
    {
        assert.deepStrictEqual(toCapitalizedCase("", "_"), "");
        assert.deepStrictEqual(toCapitalizedCase("foo", "_"), "foo");
        assert.deepStrictEqual(toCapitalizedCase("foo_bar_baz", "_"), "fooBarBaz");
    });

    it("snake_case to PascalCase", function ()
    {
        assert.deepStrictEqual(toCapitalizedCase("", "_", { capitalizeInitial : true }), "");
        assert.deepStrictEqual(toCapitalizedCase("foo", "_", { capitalizeInitial : true }), "Foo");
        assert.deepStrictEqual(toCapitalizedCase("foo_bar_baz", "_", { capitalizeInitial : true }), "FooBarBaz");
    });
};
