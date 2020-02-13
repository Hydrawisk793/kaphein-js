module.exports = (function ()
{
    var _hasOwnProperty = Object.prototype.hasOwnProperty;

    /**
     *  @type {
            <Ac, C extends Function, P>(
                parentCtor : Ac,
                ctor : C,
                proto : P
            ) => (
                {
                    new (...args : Parameters<C>) : (Omit<(Ac extends new (...args : any[]) => infer A ? A : any), keyof P> & P);
                    prototype : (Omit<(Ac extends new (...args : any[]) => infer A ? A : any), keyof P> & P);
                }
                & Omit<Ac, "apply"|"call"|"bind"|"name"|"prototype"|"arguments"|"caller"|"length"|"toString">
                & Omit<C, "apply"|"call"|"bind"|"name"|"prototype"|"arguments"|"caller"|"length"|"toString">
            )
        }
    */
    function extendClass(parentCtor, ctor, proto)
    {
        if("function" !== typeof parentCtor) {
            throw new TypeError("'parentCtor' must be a function.");
        }

        if("function" !== typeof ctor) {
            throw new TypeError("'ctor' must be a function.");
        }

        if("undefined" === typeof proto || null === proto) {
            throw new TypeError("'proto' must not be undefined or null.");
        }

        ctor.prototype = Object.assign(
            Object.create(parentCtor.prototype),
            proto,
            {
                constructor : ctor,
            }
        );

        Object
            .keys(parentCtor)
            .forEach(
                function (key)
                {
                    if(_hasOwnProperty.call(parentCtor, key)) {
                        ctor[key] = parentCtor[key];
                    }
                }
            )
        ;

        return ctor;
    }

    return {
        extendClass : extendClass,
    };
})();
