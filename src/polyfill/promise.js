var isPromiseLike = require("../type-trait").isPromiseLike;

/* eslint-disable no-extend-native */

if(Promise && "function" === typeof Promise) {
    if(!Promise.allSettled) {
        /**
         *  @param {Iterable<Promise<any>>} iterable
         */
        Promise.allSettled = function allSettled(iterable)
        {
            var promises = [];
            var items = Array.from(iterable);
            for(var i = 0; i < items.length; ++i) {
                var item = items[i];

                var promise = null;
                if(item instanceof Promise || isPromiseLike(item)) {
                    promise = item.then(
                        function (value)
                        {
                            return {
                                status : "fulfilled",
                                value : value
                            };
                        },
                        function (reason)
                        {
                            return {
                                status : "rejected",
                                reason : reason
                            };
                        }
                    );
                }
                else {
                    promise = new Promise(
                        // eslint-disable-next-line no-loop-func
                        function (resolve)
                        {
                            resolve({
                                status : "fulfilled",
                                value : item
                            });
                        }
                    );
                }

                promises.push(promise);
            }

            return Promise.all(promises);
        };
    }
}
