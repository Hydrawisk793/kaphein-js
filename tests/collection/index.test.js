const ArrayQueueTest = require("./suites/array-queue.test");
const ListQueueTest = require("./suites/list-queue.test");
const RbTreeSetTest = require("./suites/rb-tree-set.test");
const RbTreeMapTest = require("./suites/rb-tree-map.test");

describe("collection", function ()
{
    describe("ArrayQueue", ArrayQueueTest.bind(this));
    describe("ListQueue", ListQueueTest.bind(this));
    describe("RbTreeSetTest", RbTreeSetTest.bind(this));
    describe("RbTreeMapTest", RbTreeMapTest.bind(this));
});
