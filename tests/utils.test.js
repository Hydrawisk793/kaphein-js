const { assert } = require("chai");

const { findArrayChanges } = require("../src");

describe("utils", function()
{
    it("findArrayChanges", function ()
    {
        const before = [10000];
        const after = [];
        const result = findArrayChanges(before, after);
        assert.deepStrictEqual(result.removedItems, before);
        assert.deepStrictEqual(result.addedItems, []);
    });
});
