/* eslint-disable no-native-reassign, no-global-assign */

if(!Reflect) {
    Reflect = {
        /**
         *  @param {Function} target
         *  @param {ArrayLike<any>} argumentsList
         *  @param {Function} [newTarget]
         */
        construct(target, argumentsList)
        {
            /** @type {Function} */var newTarget = arguments[2];

            return target.apply(
                Object.create("undefined" === newTarget ? target.prototype : newTarget.prototype),
                argumentsList
            );
        },

        apply(target, thisArg, argList)
        {
            return target.apply(thisArg, argList);
        },

        has(target, propertyKey)
        {
            return propertyKey in target;
        },

        deleteProperty(target, propertyKey)
        {
            delete target[propertyKey];
        },
    };
}
