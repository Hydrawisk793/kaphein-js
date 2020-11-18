const { assert } = require("chai");

const { toDelimiterSeparatedCase } = require("../../../src");

module.exports = function ()
{
    it("camelCase to kebab-case", function ()
    {
        assert.deepStrictEqual(toDelimiterSeparatedCase("", "-"), "");
        assert.deepStrictEqual(toDelimiterSeparatedCase("foo", "-"), "foo");
        assert.deepStrictEqual(toDelimiterSeparatedCase("fooBarBaz", "-"), "foo-bar-baz");
        assert.deepStrictEqual(toDelimiterSeparatedCase("foo1a", "-"), "foo-1a");
        assert.deepStrictEqual(toDelimiterSeparatedCase("foo1abCa", "-"), "foo-1ab-ca");
        assert.deepStrictEqual(toDelimiterSeparatedCase("foo123abCa", "-"), "foo-123ab-ca");
        assert.deepStrictEqual(toDelimiterSeparatedCase("fooA123BcZx", "-"), "foo-a-123-bc-zx");
    });

    it("PascalCase to kebab-case", function ()
    {
        assert.deepStrictEqual(toDelimiterSeparatedCase("", "-"), "");
        assert.deepStrictEqual(toDelimiterSeparatedCase("Foo", "-"), "foo");
        assert.deepStrictEqual(toDelimiterSeparatedCase("FooBarBaz", "-"), "foo-bar-baz");
        assert.deepStrictEqual(toDelimiterSeparatedCase("Foo1a", "-"), "foo-1a");
        assert.deepStrictEqual(toDelimiterSeparatedCase("Foo1abCa", "-"), "foo-1ab-ca");
        assert.deepStrictEqual(toDelimiterSeparatedCase("Foo123abCa", "-"), "foo-123ab-ca");
        assert.deepStrictEqual(toDelimiterSeparatedCase("FooA123BcZx", "-"), "foo-a-123-bc-zx");
    });
};
