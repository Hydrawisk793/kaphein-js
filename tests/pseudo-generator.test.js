const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require("chai").expect;

const createPseudoAsyncGeneratorFunction = require("../src").createPseudoAsyncGeneratorFunction;

describe("PseudoAsyncGenerator", function ()
{
    async function wait(result, timeout)
    {
        return new Promise(
            function (resolve)
            {
                setTimeout(
                    function ()
                    {
                        resolve(result);
                    },
                    timeout
                );
            }
        );
    }

    async function runGeneratorsWithForAwaitOf(pGen, gen)
    {
        let pGenLoopCount = 0;
        const pGenResults = [];
        for await(let r of pGen()) {
            pGenResults.push(r);
            ++pGenLoopCount;
        }

        const genResults = [];
        let genLoopCount = 0;
        for await(let r of gen()) {
            genResults.push(r);
            ++genLoopCount;
        }

        return {
            pGen : {
                results : pGenResults,
                loopCount : pGenLoopCount,
            },
            gen : {
                results : genResults,
                loopCount : genLoopCount,
            }
        };
    }

    async function testNoThrowGenerators(pGen, gen)
    {
        const result = await runGeneratorsWithForAwaitOf(pGen, gen);
        expect(result.pGen.results).to.deep.equal(result.gen.results);
        expect(result.pGen.loopCount).to.deep.equal(result.gen.loopCount);
    }

    describe("#basic", function ()
    {
        it("should handle normal yields", async function ()
        {
            this.timeout(0);

            async function* gen()
            {
                yield "a";

                yield "b";

                return "c";
            }

            const pGen = createPseudoAsyncGeneratorFunction(
                function (context)
                {
                    const state = context.state;
                    let seq = ("number" === typeof state.seq ? state.seq : 0);
                    let result = null;
                    let loop = true;
                    do {
                        switch(seq) {
                        case 0:
                            result = "a";

                            loop = false;
                            ++seq;
                        break;
                        case 1:
                            result = "b";

                            loop = false;
                            ++seq;
                        break;
                        case 2:
                            result = "c";
                            context.finish();

                            loop = false;
                            ++seq;
                        break;
                        default:
                            // Does nothing.
                        }
                    }
                    while(loop);
                    state.seq = seq;

                    return result;
                }
            );

            await testNoThrowGenerators(pGen, gen);
        });

        it("should handle promise yields", async function ()
        {
            this.timeout(0);

            async function* gen()
            {
                yield wait("a", 100);

                yield wait("b", 100);

                yield wait("c", 100);

                return null;
            }

            const pGen = createPseudoAsyncGeneratorFunction(
                function (context)
                {
                    const state = context.state;
                    let seq = ("number" === typeof state.seq ? state.seq : 0);
                    let result = null;
                    let loop = true;
                    do {
                        switch(seq) {
                        case 0:
                            result = wait("a", 100);

                            loop = false;
                            ++seq;
                        break;
                        case 1:
                            result = wait("b", 100);

                            loop = false;
                            ++seq;
                        break;
                        case 2:
                            result = wait("c", 100);

                            loop = false;
                            ++seq;
                        break;
                        case 3:
                            result = void 0;
                            context.finish();

                            loop = false;
                            ++seq;
                        break;
                        default:
                            // Does nothing.
                        }
                    }
                    while(loop);
                    state.seq = seq;

                    return result;
                }
            );

            await testNoThrowGenerators(pGen, gen);
        });
    });

    describe("#delegation", function ()
    {
        it("should delegate generators.", async function ()
        {
            this.timeout(0);

            async function* asyncTask01()
            {
                yield await wait("wait");
            }

            async function* asyncTask02()
            {
                yield* asyncTask01();
            }

            async function* asyncTask03()
            {
                yield* asyncTask02();
            }

            async function* gen()
            {
                yield* asyncTask03();
                yield* asyncTask01();
            }

            const pGen = createPseudoAsyncGeneratorFunction(
                function (context)
                {
                    const state = context.state;
                    let seq = ("number" === typeof state.seq ? state.seq : 0);
                    let result = null;
                    let loop = true;
                    do {
                        switch(seq) {
                        case 0:
                            result = context.delegate(asyncTask03());

                            loop = false;
                            ++seq;
                        break;
                        case 1:
                            result = context.delegate(asyncTask01());

                            loop = false;
                            ++seq;
                        break;
                        case 2:
                            result = "finished";
                            context.finish();

                            loop = false;
                            ++seq;
                        break;
                        default:
                            // Does nothing.
                        }
                    }
                    while(loop);
                    state.seq = seq;

                    return result;
                }
            );

            await testNoThrowGenerators(pGen, gen);
        });

        it("should handle the promise-type value of IteratorResult returned from the delegated generator.", async function ()
        {
            this.timeout(0);

            function* syncTask()
            {
                yield "sync 1";
                yield "sync 2";
                yield "sync 3";

                return "end of sync";
            }

            async function* asyncTask()
            {
                yield await wait("async 1", 100);
                yield wait("async 2", 100);
                yield await wait("async 3", 100);
                yield wait("async 4", 100);

                return "end of async";
            }

            function* subTask1()
            {
                yield wait("async?? 1", 100);
                yield "foo";
                yield wait("async?? 2", 100);
                yield "bar";
                yield wait("async?? 3", 100);

                return "end of sub1";
            }

            function* subTask2()
            {
                yield wait("async?? 1", 100);
                yield "qux";
                yield wait("async?? 2", 100);
                yield "piyo";
                yield wait("async?? 3", 100);

                return "end of sub2";
            }

            async function* gen()
            {
                yield* syncTask();
                yield* asyncTask();
                yield* subTask1();
                yield* subTask2();

                return "finished";
            }

            const pGen = createPseudoAsyncGeneratorFunction(
                function (context)
                {
                    const state = context.state;
                    let seq = ("number" === typeof state.seq ? state.seq : 0);
                    let result = null;
                    let loop = true;
                    do {
                        switch(seq) {
                        case 0:
                            result = context.delegate(syncTask());

                            loop = false;
                            ++seq;
                        break;
                        case 1:
                            result = context.delegate(asyncTask());

                            loop = false;
                            ++seq;
                        break;
                        case 2:
                            result = context.delegate(subTask1());

                            loop = false;
                            ++seq;
                        break;
                        case 3:
                            result = context.delegate(subTask2());

                            loop = false;
                            ++seq;
                        break;
                        case 4:
                            result = "finished";
                            context.finish();

                            loop = false;
                            ++seq;
                        break;
                        default:
                            // Does nothing.
                        }
                    }
                    while(loop);
                    state.seq = seq;

                    return result;
                }
            );

            await testNoThrowGenerators(pGen, gen);
        });

        it("should pass the final return value of the delegated generator to context.lastYieldedValue.", async function ()
        {
            this.timeout(0);

            function* createSubSubTask()
            {
                yield "a";

                yield "b";

                yield "c";

                return "d";
            }
            async function* createSubTask()
            {
                yield [1, 2];

                yield Promise.resolve([3, 4]);

                return [7, 8];
            }
            async function* createAsyncSubTask()
            {
                let value = null;

                value = await Promise.resolve("load a");

                yield value;

                value = await Promise.resolve("load b");

                yield value;

                value = await Promise.resolve("load c");

                yield value;

                return "load complete";
            }

            async function* gen()
            {
                let nextArgs = null;

                yield Promise.resolve(5);

                yield 7;

                nextArgs = yield* createAsyncSubTask();

                yield nextArgs;

                nextArgs = yield* createSubTask();

                yield nextArgs;

                yield 2;

                yield* createSubSubTask();

                return 0;
            }

            const pGen = createPseudoAsyncGeneratorFunction(
                function (context)
                {
                    var state = context.state;
                    var result = null;
                    var sequence = ("number" === typeof state.sequence ? state.sequence : 0);

                    var loop = true;
                    do {
                        switch(sequence) {
                        case 0:
                            result = Promise.resolve(5);

                            ++sequence;
                            loop = false;
                        break;
                        case 1:
                            result = Promise.resolve(7);

                            ++sequence;
                            loop = false;
                        break;
                        case 2:
                            result = context.delegate(createAsyncSubTask());

                            ++sequence;
                            loop = false;
                        break;
                        case 3:
                            result = context.lastYieldedValue;

                            ++sequence;
                            loop = false;
                        break;
                        case 4:
                            result = context.delegate(createSubTask());

                            ++sequence;
                            loop = false;
                        break;
                        case 5:
                            result = context.lastYieldedValue;

                            ++sequence;
                            loop = false;
                        break;
                        case 6:
                            result = 2;

                            ++sequence;
                            loop = false;
                        break;
                        case 7:
                            result = context.delegate(createSubSubTask());

                            ++sequence;
                            loop = false;
                        break;
                        default:
                            result = void 0;
                            context.finish();

                            ++sequence;
                            loop = false;
                        }

                        state.sequence = sequence;
                    }
                    while(loop);

                    return result;
                }
            );

            await testNoThrowGenerators(pGen, gen);
        });
    });
});
