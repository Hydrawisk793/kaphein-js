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

function case3()
{
    var p = new Promise(function (resolve, reject) {
        setTimeout(function () {reject(new Error("error"));}, 3000);
    });
    var c1 = p.catch(function (error) { console.log("catch", "1", error); });
    var c2 = p.catch(function (error) { console.log("catch", "2", error); });
    var c3 = p.catch(function (error) { console.log("catch", "3", error); });
    var c4 = p.catch(function (error) { console.log("catch", "4", error); });
    var c5 = p.catch(function (error) { console.log("catch", "5", error); });
    var c6 = p.catch(function (error) { console.log("catch", "6", error); });
    var c7 = p.catch(function (error) { console.log("catch", "7", error); });
    console.log(p, c1, c2, c3, c4, c5, c6, c7);

    setTimeout(
        function ()
        {
            console.log(p, c1, c2, c3, c4, c5, c6, c7);
        },
        3500
    );
}

case3();
