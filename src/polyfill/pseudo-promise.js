var SymbolType = require("./pseudo-symbol").getSymbolConstructor();

function PseudoPromise(executor)
{
    PseudoPromise._register(this);

    this._executor = executor;
    this._state = "pending";
    this._resolve = this._resolve.bind(this);
    this._reject = this._reject.bind(this);
    this._onExecuting = this._onExecuting.bind(this);

    setTimeout(this._onExecuting, 0);
}

PseudoPromise.resolve = function resolve(/*value*/)
{

};

PseudoPromise.reject = function reject(/*reason*/)
{

};

PseudoPromise.all = function all(/*iterable*/)
{

};

PseudoPromise.race = function race(/*iterable*/)
{

};

PseudoPromise.prototype.then = function then()
{

};

PseudoPromise.prototype.catch = function ()
{

};

PseudoPromise.prototype.finally = function ()
{

};

PseudoPromise._promises = {

};

/**
 *  @param {PseudoPromise} pseudoPromise
 */
PseudoPromise._register = function (pseudoPromise)
{
    var key;

    for(key = SymbolType("Promise"); !(key in PseudoPromise._promises); key = SymbolType("Promise"));
    PseudoPromise._promises[key] = pseudoPromise;

    pseudoPromise._key = key;

    return key;
};

PseudoPromise.prototype._onExecuting = function ()
{
    this._executor.call(null, this._resolve, this._reject);
};

PseudoPromise.prototype._resolve = function (/*value*/)
{

};

PseudoPromise.prototype._reject = function (/*reason*/)
{

};

module.exports = {
    PseudoPromise : PseudoPromise
};
