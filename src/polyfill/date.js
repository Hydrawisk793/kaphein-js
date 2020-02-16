/* eslint-disable no-extend-native */

if(!Date.now) {
    Date.now = function now()
    {
        return new Date().getTime();
    };
}
