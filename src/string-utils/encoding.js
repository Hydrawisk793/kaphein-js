var isString = require("../type-trait").isString;

module.exports = (function ()
{
    var byteCountBorders = [
        0x80, 0x0800,
        0x010000, 0x200000,
        0x04000000, 0x80000000
    ];
    var firstByteMasks = [
        0x0000007F, 0x000007C0,
        0x0000F000, 0x001C0000,
        0x03000000, 0x40000000
    ];
    var shiftCounts = [
        0, 6, 
        12, 18,
        24, 30
    ];
    var restByteBitMasks = [
        0x00000000, 0x0000003F,
        0x00000FC0, 0x0003F000,
        0x00FC0000, 0x3F000000
    ];
    var byteCountBits = [
        0x00, 0xC0,
        0xE0, 0xF0,
        0xF8, 0xFC
    ];

    /**
     * Converts a string to utf8 byte array.
     * 
     *  @param {string} str A string to be converted.
     */
    function toUtf8ByteArray(str)
    {
        if(!isString(str)) {
            throw new TypeError("'str' must be a string.");
        }

        /** @type {number[]} */var byteArray = [];
        for(var i = 0; i < str.length; ++i) {
            var ch = str.charCodeAt(i);

            var restByteCount = 0;
            for(
                restByteCount = 0;
                restByteCount < byteCountBorders.length;
                ++restByteCount
            ) {
                if(ch < byteCountBorders[restByteCount]) {
                    break;
                }
            }
            if(restByteCount >= byteCountBorders.length) {
                throw new Error("");
            }

            var byteValue = (((ch & firstByteMasks[restByteCount]) >>> shiftCounts[restByteCount]) | byteCountBits[restByteCount]) & 0xFF;
            byteArray.push(byteValue);

            while(restByteCount > 0) {
                byteValue = (((ch & restByteBitMasks[restByteCount]) >>> shiftCounts[restByteCount - 1]) | 0x80) & 0xFF;
                byteArray.push(byteValue);

                --restByteCount;
            }
        }

        return byteArray;
    }

    return toUtf8ByteArray;
});
