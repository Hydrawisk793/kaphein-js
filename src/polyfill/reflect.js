/* eslint-disable no-native-reassign, no-global-assign */

if(!Reflect) {
    Reflect = {
        /**
         *  @param {Function} target
         *  @param {ArrayLike<any>} argumentsList
         *  @param {Function} [newTarget]
         */
        construct : function construct(target, argumentsList)
        {
            /** @type {Function} */var newTarget = arguments[2];

            return target.apply(
                Object.create("undefined" === typeof newTarget ? target.prototype : newTarget.prototype),
                argumentsList
            );
        },

        apply : function apply(target, thisArg, argList)
        {
            return target.apply(thisArg, argList);
        },

        has : function has(target, propertyKey)
        {
            return propertyKey in target;
        },

        deleteProperty : function deleteProperty(target, propertyKey)
        {
            delete target[propertyKey];
        }
    };
}
