var generateRandomHexString = (function ()
{
    var hexChars = "0123456789abcdef";

    return (
        /**
         *  @param {number} length
         */
        function generateRandomHexString(length)
        {
            if(!Number.isSafeInteger(length)) {
                throw new TypeError("'length' must be a safe integer.");
            }

            var maxIndex = hexChars.length - 1;
            var chars = [];
            for(var i = 0; i < length; ++i) {
                chars.push(hexChars[Math.floor((Math.random() * maxIndex))]);
            }

            return chars.join("");
        }
    );
}());

/**
 *  @param {string} str
 *  @param {string} delimiter
 */
function toCamelCase(str, delimiter)
{
    return str
        .split(delimiter)
        .reduce(
            function (acc, token)
            {
                var tokenLowerCase = token.toLowerCase();

                return (
                    "" === acc
                    ? tokenLowerCase
                    : acc + ("" !== tokenLowerCase.length ? tokenLowerCase[0].toUpperCase() + tokenLowerCase.slice(1) : tokenLowerCase)
                );
            },
            ""
        )
    ;
}

module.exports = {
    generateRandomHexString : generateRandomHexString,
    toCamelCase : toCamelCase
};
