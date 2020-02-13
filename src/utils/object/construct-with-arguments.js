/**
 *  @template T
 *  @param {new (...args : any[]) => T} ctor
 *  @param {any[] | IArguments} args
 *  @returns {T}
 */
function constructWithArguments(ctor, args)
{
    return new (ctor.bind.apply(ctor, [null].concat(args)))();
}

module.exports = {
    constructWithArguments : constructWithArguments,
};
