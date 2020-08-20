const ArrayQueueTest = require("./suites/array-queue.test");
const ListQueueTest = require("./suites/list-queue.test");
const RbTreeSetTest = require("./suites/rb-tree-set.test");
const RbTreeMapTest = require("./suites/rb-tree-map.test");
const StringKeyTrieTest = require("./suites/string-key-trie.test");

describe("collection", function ()
{
    describe("ArrayQueue", ArrayQueueTest.bind(this));
    describe("ListQueue", ListQueueTest.bind(this));
    describe("RbTreeSetTest", RbTreeSetTest.bind(this));
    describe("RbTreeMapTest", RbTreeMapTest.bind(this));
    describe("StringKeyTrieTest", StringKeyTrieTest.bind(this));
});
