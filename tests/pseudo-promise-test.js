var PseudoPromise = require("../src/polyfill/pseudo-promise").PseudoPromise;

// eslint-disable-next-line no-unused-vars
function case1()
{
    var promise = new PseudoPromise(
            function (resolve)
            {
                setTimeout(
                    function ()
                    {
                        resolve(4);
                    },
                    4000
                );
            }
        )
        .then(
            function (value)
            {
                console.log(value);

                return 5;
            }
        )
        .then(
            function (value)
            {
                console.log(value);

                return 6;
            }
        )
        .then(
            function (value)
            {
                console.log(value);

                return 7;
            }
        )
        .then(
            function (value)
            {
                console.log(value);

                return 8;
            }
        )
    ;
    console.log("promise", promise);
}

// eslint-disable-next-line no-unused-vars
function case2()
{
    var promise = new Promise(function (resolve, reject) {
        reject(new Error("rejected."));
    })
        .then(function () {console.log("then 1");}, function (error) { console.log("onRejected 1", error); })
        .then(function () {console.log("then 2"); return 999;}, function (error) { console.log("onRejected 2", error); })
        .catch(function (error) { console.log("catch", error); })
    ;
    console.log(promise);
}

function case2Pseudo()
{
    var promise = new PseudoPromise(function (resolve, reject) {
            reject(new Error("rejected."));
        })
        .then(function () {console.log("then 1");}, function (error) { console.log("onRejected 1", error); })
        .then(function () {console.log("then 2"); return 999;}, function (error) { console.log("onRejected 2", error); })
        .catch(function (error) { console.log("catch", error); })
    ;
    console.log(promise);
}

case2Pseudo();
