const toDelimiterSeparatedCaseTest = require("./suites/to-delimiter-separated-case.test");
const toCapitalizedCaseTest = require("./suites/to-capitalized-case.test");

describe("string-utils", function ()
{
    describe("toDelimiterSeparatedCase", toDelimiterSeparatedCaseTest.bind(this));
    describe("toCapitalizedCase", toCapitalizedCaseTest.bind(this));
});
