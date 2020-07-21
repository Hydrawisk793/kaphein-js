module.exports = (function ()
{
    /**
     *  @constructor
     */
    function NullLogger()
    {

    }

    NullLogger.prototype = {
        constructor : NullLogger,

        debug : function debug()
        {

        },

        trace : function trace()
        {

        },

        info : function info()
        {

        },

        warn : function warn()
        {

        },

        error : function error()
        {

        }
    };

    return {
        NullLogger : NullLogger
    };
})();
