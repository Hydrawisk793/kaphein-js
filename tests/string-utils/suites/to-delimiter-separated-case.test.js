const { assert } = require("chai");

const { toDelimiterSeparatedCase } = require("../../../src");

module.exports = function ()
{
    it("camelCase to kebab-case", function ()
    {
        assert.deepStrictEqual(toDelimiterSeparatedCase("", "-"), "");
        assert.deepStrictEqual(toDelimiterSeparatedCase("foo", "-"), "foo");
        assert.deepStrictEqual(toDelimiterSeparatedCase("fooBarBaz", "-"), "foo-bar-baz");
    });

    it("PascalCase to kebab-case", function ()
    {
        assert.deepStrictEqual(toDelimiterSeparatedCase("", "-"), "");
        assert.deepStrictEqual(toDelimiterSeparatedCase("Foo", "-"), "foo");
        assert.deepStrictEqual(toDelimiterSeparatedCase("FooBarBaz", "-"), "foo-bar-baz");
    });
};
