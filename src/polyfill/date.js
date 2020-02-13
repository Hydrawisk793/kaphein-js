/* eslint-disable no-extend-native */

if(!Date.now) {
    Date.now = function ()
    {
        return new Date().getTime();
    };
}
