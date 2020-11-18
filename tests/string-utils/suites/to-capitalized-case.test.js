const { assert } = require("chai");

const { toCapitalizedCase } = require("../../../src");

module.exports = function ()
{
    it("snake_case to camelCase", function ()
    {
        assert.deepStrictEqual(toCapitalizedCase("", "_"), "");
        assert.deepStrictEqual(toCapitalizedCase("foo", "_"), "foo");
        assert.deepStrictEqual(toCapitalizedCase("foo_bar_baz", "_"), "fooBarBaz");
        assert.deepStrictEqual(toCapitalizedCase("foo_1ab_ca", "_"), "foo1abCa");
        assert.deepStrictEqual(toCapitalizedCase("foo_123ab_ca", "_"), "foo123abCa");
    });

    it("snake_case to PascalCase", function ()
    {
        assert.deepStrictEqual(toCapitalizedCase("", "_", { capitalizeInitial : true }), "");
        assert.deepStrictEqual(toCapitalizedCase("foo", "_", { capitalizeInitial : true }), "Foo");
        assert.deepStrictEqual(toCapitalizedCase("foo_bar_baz", "_", { capitalizeInitial : true }), "FooBarBaz");
        assert.deepStrictEqual(toCapitalizedCase("foo_1a", "_", { capitalizeInitial : true }), "Foo1a");
        assert.deepStrictEqual(toCapitalizedCase("foo_1ab_ca", "_", { capitalizeInitial : true }), "Foo1abCa");
        assert.deepStrictEqual(toCapitalizedCase("foo_123ab_ca", "_", { capitalizeInitial : true }), "Foo123abCa");
    });
};
